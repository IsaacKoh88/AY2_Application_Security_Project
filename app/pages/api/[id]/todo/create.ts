import type { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from '../../../../utils/connections/db';
import authorisedValidator from '../../../../utils/api/authorised-validator';
import postValidator from '../../../../utils/api/post-validator';
import inputFormat from '../../../../utils/input-format';
import apiErrorHandler from '../../../../utils/api/api-error-handler';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

type Data = {
    message: string
}

export default async function CreateTodo(
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
            if (!new inputFormat().validatetext255requried(req.body.todoName)) {
                throw 400;
            }
            if (!new inputFormat().validatedate(req.body.date)) {
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
    const { todoName, date } = req.body;

    try {
        const totalTodos = JSON.parse(JSON.stringify(await executeQuery({
            query: 'CALL selectTotalTodos(?)',
            values: [req.query.id],
        })));

        if (totalTodos[0][0]['COUNT(*)'] < 100) {
            var id = uuidv4();
            var idcheck = JSON.parse(JSON.stringify(await executeQuery({
                query: 'CALL selectCountTodoID(?)',
                values: [id],
            })));
            var totalCount = 1

            while (idcheck[0][0]['COUNT(*)'] == 1 && totalCount < 100) {              
                id = uuidv4()
                var idcheck = JSON.parse(JSON.stringify(await executeQuery({
                    query: 'CALL selectCountTodoID(?)',
                    values: [id],
                })));
                totalCount += 1
            }
            if (totalCount >= 100) {
                res.status(500).json({message: 'Too many uuids checked, please try again'})
                return
            }
            else {
                /* insert data into calendar table */ 
                const result = await executeQuery({
                    query: 'CALL insertTodoData(?, ?, ?, ?)',
                    values: [req.query.id, id, todoName, date],
                });

                res.status(201).json({ message: 'success' })
                return
            }
        }
        /** more than 100 categories */
        else {
            res.status(409).json({ message: 'Too many Todos created, please remove some before adding more'});
        }
    }
    /** unexpected error */
    catch {
        res.statusCode = 500;
        res.end('Unexpected Error');
    }
}

/**
API request body must follow the structure below

{
    todoName: string,       required    (between 1 and 255 characters long)
    date: string,           required    (YYYY-MM-DD format)
}

Requires authentication?    yes

Response format             201         json        {message: 'success'}

Errors
304         limit of 50 todos has been reached
400         request body not following above structure
401         unauthenticated
405         request not using POST method
500         unexpected server error

*/