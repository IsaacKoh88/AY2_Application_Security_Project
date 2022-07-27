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

        /* validate input */
        const dateregex = /([1-2]?[0][8-9]?[0-9]?[0-9])-(0[0-9]|1[0-2])-(0[1-9]|[1-2]?[0-9]|3[0-1])/
        if (accountID === '' || accountID.length !== 36 || expenseName === '' || expenseName.length >= 255 || amount <= 0 || date === '' || dateregex.test(date)===false){
            res.statusCode = 400;
            res.end('Request format error');
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