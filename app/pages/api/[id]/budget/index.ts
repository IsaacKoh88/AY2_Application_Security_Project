import type { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from '../../../../utils/connections/db'
import authorisedValidator from '../../../../utils/api/authorised-validator';
import apiErrorHandler from '../../../../utils/api/api-error-handler';
import dayjs from 'dayjs';

type Data = {
    Budget: number,
    circleStyle: string,
} | {
    message: string
}

export default async function GetBudget(
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

        /* get budget */
        const result = JSON.parse(JSON.stringify(await executeQuery({
            query: 'CALL selectBudget_AccountID(?)',
            values: [req.query.id],
        })));

        const resultTotalExpense = JSON.parse(JSON.stringify(await executeQuery({
            query: 'CALL selectSumExpense_AccountID_Month(?, ?)',
            values: [req.query.id, dayjs().format('YYYY-MM-DD')],
        })));

        var totalExpense = 0
        if (resultTotalExpense[0][0]['TotalExpense'] !== null) {
            totalExpense = resultTotalExpense[0][0]['TotalExpense']
        }

        const expenseDifference = result[0].Budget - totalExpense
        if (expenseDifference == 0){
            var circleStyle = 'blue'
        }
        else if (expenseDifference > 0) {
            var circleStyle = 'green'
        }
        else{
            var circleStyle = 'red'
        }

        res.status(200).json({ Budget: result[0][0].Budget, circleStyle: circleStyle })

    };
};