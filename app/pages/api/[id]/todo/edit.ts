import type { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from '../../../../utils/db'
import authorisedValidator from '../../../../utils/authorised-validator';

type Data = {
    message: string
}

export default async function EditTodo(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    /* accepts only POST requests and non-empty requests */
    if ((req.method == 'POST') && (req.body) && (req.cookies['token'])) {
        /** check user authorisation */
        await authorisedValidator(req, res);

        /** deconstruct body data */
        const { todoID, todoName, date } = req.body;

        /* insert data into category table */
        const result = await executeQuery({
            query: 'UPDATE todo SET Name=?, Date=? WHERE AccountID=? AND ID=?',
            values: [todoName, date, req.query.id, todoID],
        });

        res.status(201).json({ message: 'success' })
        return
    }
    /* rejects requests that are empty */
    else if (!req.body) {
        res.statusCode = 405;
        res.end('Error');
        return
    }
}