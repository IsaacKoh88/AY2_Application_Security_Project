import type { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from '../../../../utils/db'
import authorisedValidator from '../../../../utils/authorised-validator';

type Data = {
    message: string
}

export default async function DeleteTodo(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    /* accepts only POST requests and non-empty requests */
    if ((req.method == 'POST') && (req.body) && (req.cookies['token'])) {
        /** check user authorisation */
        await authorisedValidator(req, res);

        try {
            /** deconstruct body data */
            const { todoID } = req.body;

            if (todoID.length === 36) {
                /* insert data into category table */
                const result = await executeQuery({
                    query: 'CALL deleteTodoData(?, ?)',
                    values: [req.query.id, todoID],
                });

                res.status(200).json({ message: 'success' })
                return
            }
            /** if request body components do not fit requirements */
            else {
                res.statusCode = 400;
                res.end('Request format error');
            }
        }
        /** if request body components do not fit requirements */
        catch {
            res.statusCode = 400;
            res.end('Request format error');
        }
    }
    /* rejects requests that are empty */
    else if (req.method !== 'POST') {
        res.statusCode = 405;
        res.end('Error');
        return
    }
    /** if request body components do not fit requirements */
    else if (!req.body) {
        res.statusCode = 400;
        res.end('Request format error');
        return
    }
    /** if user is not authenticated */
    else if (!req.cookies['token']) {
        res.statusCode = 401;
        res.end('Unauthorised');
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