import type { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from '../../../../utils/connections/db'
import authorisedValidator from '../../../../utils/api/authorised-validator';
import postValidator from '../../../../utils/api/post-validator';
import apiErrorHandler from '../../../../utils/api/api-error-handler';
import inputFormat from '../../../../utils/input-format';

type Data = {
    message: string
}

export default async function EditNotes(
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
            if (!new inputFormat().validateuuid(req.body.notesID)) {
                throw 400;
            }
            if (!new inputFormat().validatetext255requried(req.body.notesName)) {
                throw 400;
            }
            if ((req.body.description) && (!new inputFormat().validatetextblock(req.body.description))) {
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
    const { notesID, notesName, description } = req.body;

    try {
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
    
        res.status(201).json({ message: 'success' });
        return
    }
    catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}