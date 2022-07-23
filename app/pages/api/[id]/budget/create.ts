import type { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from '../../../../utils/db'
import authorisedValidator from '../../../../utils/authorised-validator';
import { v4 as uuidv4 } from 'uuid';

type Data = {
    message: string
}

export default async function CreateBudget(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    /* accepts only POST requests and non-empty requests */
    if ((req.method == 'POST') && (req.body) && (req.cookies['token'])) {
        /** check user authorisation */
        await authorisedValidator(req, res);

        /** deconstruct body data */
        const { AccountID, Name, Amount } = req.body;

        /** generate uuidv4 */
        const id = uuidv4();

        /* insert data into category table */
        const result = await executeQuery({
            query: 'CALL insertBudgetData(?, ?, ?)',
            values: [AccountID, Name, Amount],
        });

        res.statusCode = 200;
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