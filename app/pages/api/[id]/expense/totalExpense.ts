import type { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from '../../../../utils/db'
import authorisedValidator from '../../../../utils/authorised-validator';

type Data = {
    TotalExpense: number,
}

export default async function GetExpense(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    /* accepts only GET requests and non-empty requests */
    if ((req.method == 'POST') && (req.cookies['token'])) {
        /** check user authorisation */
        await authorisedValidator(req, res);

        /** get total expenses */
        const result = JSON.parse(JSON.stringify(await executeQuery({
            query: 'CALL selectSumExpense_AccountID(?)',
            values: [req.query.id],
        })));

        res.status(200).json(result[0][0].TotalExpense);
        res.end('OK');
        return
    };
};