import type { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from '../../../../utils/connections/db'
import authorisedValidator from '../../../../utils/api/authorised-validator';
import getValidator from '../../../../utils/api/get-validator';
import apiErrorHandler from '../../../../utils/api/api-error-handler';

type Data = {
    message: string
}

export default async function DeleteDoneTodos(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    try {
        /** check user authorisation */
        await authorisedValidator(req);

        /** check if request is POST */
        await getValidator(req);
    }
    catch (error) {
        apiErrorHandler(error, res);
        return
    }

    try {
        /* delete checked todos from table */
        const result = JSON.parse(JSON.stringify(await executeQuery({
            query: 'DELETE * FROM todo WHERE AccountID = ? AND Checked = 1',
            values: [req.query.id],
        })));

        res.status(200).json({ message: 'success' })
        return
    }
    catch {
        res.status(500).json({ message: 'Internal server error' })
        return
    }
};