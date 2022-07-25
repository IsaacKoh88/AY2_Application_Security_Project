import type { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from '../../../../utils/db'
import authorisedValidator from '../../../../utils/authorised-validator';

type Data = {
    message: string
}

export default async function CreateExpense(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    /* accepts only POST requests and non-empty requests */
    if ((req.method == 'POST') && (req.body) && (req.cookies['token'])) {
        /** check user authorisation */
        await authorisedValidator(req, res);

        /** deconstruct body data */
        const { accountID, expenseName, amount, date } = req.body;

        if (expenseName == ''){
            res.statusCode = 400;
            res.end('Success');
            return

        }
        
        /* insert data into expense table */
        const result = await executeQuery({
            query: 'CALL insertExpenseData(?, ?, ?, ?)',
            values: [accountID, expenseName, amount, date],
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