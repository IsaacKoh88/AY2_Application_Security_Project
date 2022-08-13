import type { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from '../../../../utils/db'
import authorisedValidator from '../../../../utils/authorised-validator';
import apiErrorHandler from '../../../../utils/api-error-handler';

type Data = {
    message: string
}

export default async function DeleteExpense(
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

        /** deconstruct body data */
        const { accountID, id } = req.body;

        /* delete data from expense table */
        const result = await executeQuery({
            query: 'CALL deleteExpenseData(?, ?)',
            values: [accountID, id],
        });

        res.statusCode = 201;
        res.end('Success');
        return
    }
    /* rejects requests that are empty */
    else if (!req.body) {
        res.statusCode = 405;
        res.end('Error');
        return
    }
}