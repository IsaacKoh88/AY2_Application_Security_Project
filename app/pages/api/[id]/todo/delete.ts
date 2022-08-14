import type { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from '../../../../utils/connections/db'
import authorisedValidator from '../../../../utils/api/authorised-validator';
import postValidator from '../../../../utils/api/post-validator';
import inputFormat from '../../../../utils/input-format';
import apiErrorHandler from '../../../../utils/api/api-error-handler';

type Data = {
    message: string
}

export default async function DeleteTodo(
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

    /** deconstruct body data */
    const { todoID } = req.body;

    try {
        const idcheck = JSON.parse(JSON.stringify(await executeQuery({
            query: 'CALL selectCountTodoID(?)',
            values: [todoID],
        })));
        if (idcheck[0][0]['COUNT(*)'] === 1) {
            /* insert data into category table */
            const result = await executeQuery({
                query: 'CALL deleteTodoData(?, ?)',
                values: [req.query.id, todoID],
            });

            res.status(200).json({ message: 'success' })
            return
        }
        /** event ID does not exist */
        else {
            res.status(404).json({ message: 'Todo not found' })
            return
        }
    }
    catch {
        res.status(500).json({ message: 'Internal server error' })
        return
    }
}

/**
API request body must follow the structure below

{
    todoID: string      required    (36 character UUID format & must be a valid categoryID)
}

Requires authentication?    yes

Response format             200         json        {message: 'success'}

Errors
400         request body not following above structure
401         unauthenticated
405         request not using POST method

*/