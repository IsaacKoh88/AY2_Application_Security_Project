import type { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from '../../../../utils/connections/db'
import authorisedValidator from '../../../../utils/api/authorised-validator';
import postValidator from '../../../../utils/api/post-validator';
import inputFormat from '../../../../utils/input-format';
import apiErrorHandler from '../../../../utils/api/api-error-handler';

type Data = {
    message: string
}

export default async function EditTodo(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    try {
        /** check user authorisation */
        await authorisedValidator(req);

        /** check if request is POST */
        await postValidator(req);

        /** validate if request params are correct */
        if (!new inputFormat().validateuuid(req.query.id)) {
            throw 400;
        };
        try {
            if (!new inputFormat().validateuuid(req.body.todoID)) {
                throw 400;
            }
        } catch {
            throw 400;
        }
    }
    catch (error) {
        apiErrorHandler(error, res);
        return
    }

    try {
        /** deconstruct body data */
        const { todoID, checked } = req.body;

        if ((todoID.length === 36) && (checked === 1 || checked === 0)) {

            try {
                const idcheck = JSON.parse(JSON.stringify(await executeQuery({
                    query: 'CALL selectCountTodoID(?)',
                    values: [todoID],
                })));

                if (idcheck[0][0]['COUNT(*)'] === 1) {
                    /* insert data into category table */
                    const result = await executeQuery({
                        query: 'CALL updateTodo_check(?, ?, ?)',
                        values: [req.query.id, todoID, checked],
                    });

                    res.status(201).json({ message: 'success' })
                    return
                }
                /** event ID does not exist */
                else {
                    res.statusCode = 404;
                    res.end('Event not found');
                }
            }
            /** event ID does not exist */
            catch {
                res.statusCode = 404;
                res.end('Event not found');
            }
        }
        /** if request body components do not fit requirements */
        else {
            res.statusCode = 400;
            res.end('Request format error');
        }
    }
    /** if request body components do not fit requirements */
    catch {
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

/**
API request body must follow the structure below

{
    todoID: string          required    (36 character UUID format & must be a valid todoID)
    checked: number         required    (either 1 or 0)
}

Requires authentication?    yes

Response format             201         json        {message: 'success'}

Errors
400         request body not following above structure
401         unauthenticated
404         todo not found
405         request not using POST method

*/