import type { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from '../../../../utils/connections/db'
import authorisedValidator from '../../../../utils/api/authorised-validator';
import postValidator from '../../../../utils/api/post-validator';
import apiErrorHandler from '../../../../utils/api/api-error-handler';
import inputFormat from '../../../../utils/input-format';

type Data = {
    message: string
}

export default async function DeleteNotes(
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
        } catch {
            throw 400;
        }
    }
    catch (error) {
        apiErrorHandler(error, res);
        return
    }

    /** deconstruct body data */
    const { notesID } = req.body;

    /* insert data into category table */
    const result = await executeQuery({
        query: 'CALL deleteNotesData(?,?)',
        values: [req.query.id, notesID],
    });

    res.status(200).json({ message: 'success' });
    return
}