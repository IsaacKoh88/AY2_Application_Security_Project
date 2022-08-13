import type { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from '../../../../utils/connections/db'
import authorisedValidator from '../../../../utils/api/authorised-validator';
import apiErrorHandler from '../../../../utils/api/api-error-handler';

type Data = {
    totalExpense: number,
    circleStyle: string
} | {
    message: string
}

export default async function GetExpense(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    /* accepts only GET requests and non-empty requests */
    if ((req.method == 'POST') && (req.cookies['token'])) {
        try {
            /** check user authorisation */
            await authorisedValidator(req);
        }
        catch (error) {
            apiErrorHandler(error, res);
            return
        }

        const { date } = req.body;

        /** get total expenses */
        const result = JSON.parse(JSON.stringify(await executeQuery({
            query: 'CALL selectSumExpense_AccountID_Month(?, ?)',
            values: [req.query.id, date],
        })));

        const resultBudget = JSON.parse(JSON.stringify(await executeQuery({
            query: 'CALL selectBudget_AccountID(?)',
            values: [req.query.id],
        })));

        var totalExpense = 0
        if (result[0][0]['TotalExpense'] !== null) {
            totalExpense = result[0][0]['TotalExpense']
        }

        const expenseDifference = resultBudget[0][0].Budget - totalExpense
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