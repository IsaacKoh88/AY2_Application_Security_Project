import type { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from '../../../../utils/db'
import authorisedValidator from '../../../../utils/authorised-validator';

type Data = {
    totalExpense: number,
}

export default async function GetExpense(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    /* accepts only GET requests and non-empty requests */
    if ((req.method == 'POST') && (req.cookies['token'])) {
        /** check user authorisation */
        await authorisedValidator(req, res);

        const { date } = req.body;

        /** get total expenses */
        const result = JSON.parse(JSON.stringify(await executeQuery({
            query: 'CALL selectSumExpense_AccountID_Month(?, ?)',
            values: [req.query.id, date],
        })));

        var totalExpense = 0
        if (result[0][0]['TotalExpense'] !== null) {
            totalExpense = result[0][0]['TotalExpense']
        }


        res.status(200).json( { totalExpense: totalExpense } );
        return
    };
};