import type { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from '../../../../utils/db'
import authorisedValidator from '../../../../utils/authorised-validator';
import apiErrorHandler from '../../../../utils/api-error-handler';

type Data = {
    message: string
}

export default async function EditExpense(
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
        const { accountID, id, expenseName, amount, date } = req.body;

        /* validate input */
        const dateregex = /([1-2]?[0][8-9]?[0-9]?[0-9])-(0[0-9]|1[0-2])-(0[1-9]|[1-2]?[0-9]|3[0-1])/
        if (accountID === '' || accountID.length !== 36 || id === '' || id.length !== 36 || expenseName === '' || expenseName.length >= 255 || amount <= 0 || date === '' || dateregex.test(date)===false){
            res.statusCode = 400;
            res.end('Request format error');
            return
        }

        /* update data in expense table */
        const result = await executeQuery({
            query: 'CALL updateExpense(?, ?, ?, ?, ?)',
            values: [accountID, id, expenseName, amount, date],
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