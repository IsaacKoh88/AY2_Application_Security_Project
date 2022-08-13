import type { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from '../../../../utils/connections/db'
import authorisedValidator from '../../../../utils/api/authorised-validator';
import apiErrorHandler from '../../../../utils/api/api-error-handler';

type Data = {
    message: string
}

export default async function EditBudget(
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
        const { accountID, budget } = req.body;

        if (accountID === '' || accountID.length !== 36 || budget <= 0){
            res.statusCode = 400;
            res.end('Request format error');
            return
        }

        /* update budget table */
        const result = await executeQuery({
            query: 'CALL updateBudget(?, ?)',
            values: [accountID, budget],
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