import type { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from '../../../../utils/db';
import authorisedValidator from '../../../../utils/authorised-validator';
import apiErrorHandler from '../../../../utils/api-error-handler';
import { v4 as uuidv4 } from 'uuid';

type Data = {
    message: string
}

export default async function CreateNotes(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    /* accepts only POST requests and non-empty requests */
    if ((req.method == 'POST') && (req.body) && (req.cookies['token'])) {
        try {
            /** check user authorisation */
            await authorisedValidator(req);
        }
        catch (error) {
            apiErrorHandler(error, res);
            return
        }

        /** generate uuidv4 */
        const id = uuidv4();

        /** generate base data */
        const notesName = 'Untitled';
        const description = '';

        try {
            /* insert data into notes table */
            const result = await executeQuery({
                query: 'INSERT INTO notes VALUES(?, ?, ?, ?)',
                values: [req.query.id, id, notesName, description],
            });

            res.status(201).json({ message: 'success' })
            return
        }
        catch (error) {
            res.status(500)
            return
        }
    }
    /* rejects requests that are empty */
    else if (!req.body) {
        res.statusCode = 405;
        return
    }
}