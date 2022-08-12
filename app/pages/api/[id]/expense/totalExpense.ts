import type { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from '../../../../utils/db'
import authorisedValidator from '../../../../utils/authorised-validator';

type Data = {
    totalExpense: number,
    circleStyle: string
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

        const resultBudget = JSON.parse(JSON.stringify(await executeQuery({
            query: 'SELECT Budget FROM budget WHERE AccountID=?',
            values: [req.query.id],
        })));

        var totalExpense = 0
        if (result[0][0]['TotalExpense'] !== null) {
            totalExpense = result[0][0]['TotalExpense']
        }

        const expenseDifference = resultBudget[0].Budget - totalExpense
        if (expenseDifference == 0){
            var circleStyle = 'blue'
        }
        else if (expenseDifference > 0) {
            var circleStyle = 'green'
        }
        else{
            var circleStyle = 'red'
        }

        res.status(200).json( { totalExpense: totalExpense, circleStyle: circleStyle } );
        return
    };
};