import type { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from '../../../../utils/db'
import authorisedValidator from '../../../../utils/authorised-validator';
import dayjs from 'dayjs';

type Data = {
    Budget: number,
    circleStyle: string,
}

export default async function GetBudget(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    /* accepts only GET requests and non-empty requests */
    if ((req.method == 'POST') && (req.cookies['token'])) {
        /** check user authorisation */
        await authorisedValidator(req, res);

        /* get budget */
        const result = JSON.parse(JSON.stringify(await executeQuery({
            query: 'SELECT Budget FROM budget WHERE AccountID=?',
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
            var circleStyle = 'flex justify-center items-center bg-indigo-600 h-96 w-96 m-8 rounded-full'
        }
        else if (expenseDifference > 0) {
            var circleStyle = 'flex justify-center items-center bg-lime-600 h-96 w-96 m-8 rounded-full'
        }
        else{
            var circleStyle = 'flex justify-center items-center bg-red-700 h-96 w-96 m-8 rounded-full'
        }

        res.status(200).json({ Budget: result[0].Budget, circleStyle: circleStyle })

    };
};