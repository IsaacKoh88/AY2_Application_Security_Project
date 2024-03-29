import type { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from '../../../../utils/connections/db'
import authorisedValidator from '../../../../utils/api/authorised-validator';
import postValidator from '../../../../utils/api/post-validator';
import inputFormat from '../../../../utils/input-format';
import apiErrorHandler from '../../../../utils/api/api-error-handler';

type Data = {
    message: string
}

export default async function DeleteExpense(
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
            if (!new inputFormat().validateuuid(req.body.accountID)) {
                throw 400;
            }
            if (!new inputFormat().validateuuid(req.body.id)) {
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
    const { accountID, id } = req.body;

    try{
        /* delete data from expense table */
        const result = await executeQuery({
            query: 'CALL deleteExpenseData(?, ?)',
            values: [accountID, id],
        });

        res.status(201).json({ message: 'success' })
        return
    }
    catch {
        res.status(500).json({ message: 'Internal server error' })
        return
    }
}