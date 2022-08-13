import type { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from '../../../../utils/db'
import authorisedValidator from '../../../../utils/authorised-validator';

type Data = {
    message: string
}

export default async function EditNotes(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    /* accepts only POST requests and non-empty requests */
    if ((req.method == 'POST') && (req.body) && (req.cookies['token'])) {
        /** check user authorisation */
        await authorisedValidator(req, res);

        /** deconstruct body data */
        const { notesID, notesName, description } = req.body;

        if (description) {
            /* insert data into notes table */
            const result = await executeQuery({
                query: 'CALL updateNotes(?, ?, ?, ?)',
                values: [req.query.id, notesID, notesName, description],
            });
        } else {
            /* insert data into notes table */
            const result = await executeQuery({
                query: 'CALL updateNotesName(?, ?, ?)',
                values: [req.query.id, notesID, notesName],
            });
        }

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