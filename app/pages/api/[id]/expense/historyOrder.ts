import type { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from '../../../../utils/connections/db'
import authorisedValidator from '../../../../utils/api/authorised-validator';
import apiErrorHandler from '../../../../utils/api/api-error-handler';

type Expenses = {
    ID: string,
    Name: string,
    Amount: number,
    Date: string
}[]

type Data = {
    Result: Expenses,
    totalExpense: number
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

        const { OrderBy, ID, Month } = req.body;

        /* Get the total expense for the selected month */
        const totalExpenses = JSON.parse(JSON.stringify(await executeQuery({
            query: 'CALL selectSumExpense_AccountID_Month(?, ?)',
            values: [req.query.id, Month],
        })));

        var totalExpense = 0
        if (totalExpenses[0][0]['TotalExpense'] !== null) {
            totalExpense = totalExpenses[0][0]['TotalExpense']
        }

        /** get expenses based on OrderBy */
        if (OrderBy == 'Date Ascending'){
            var result = JSON.parse(JSON.stringify(await executeQuery({
                query: 'CALL selectExpenseData_DateAsc(?, ?)',
                values: [ID, Month],
            })));
        }
        else if (OrderBy == 'Date Descending'){
            var result = JSON.parse(JSON.stringify(await executeQuery({
                query: 'CALL selectExpenseData_DateDesc(?, ?)',
                values: [ID, Month],
            })));
        }
        else if (OrderBy == 'Name Ascending'){
            var result = JSON.parse(JSON.stringify(await executeQuery({
                query: 'CALL selectExpenseData_NameAsc(?, ?)',
                values: [ID, Month],
            })));
        }
        else if (OrderBy == 'Name Descending'){
            var result = JSON.parse(JSON.stringify(await executeQuery({
                query: 'CALL selectExpenseData_NameDesc(?, ?)',
                values: [ID, Month],
            })));
        }
        else if (OrderBy == 'Amount Ascending'){
            var result = JSON.parse(JSON.stringify(await executeQuery({
                query: 'CALL selectExpenseData_AmountAsc(?, ?)',
                values: [ID, Month],
            })));
        }
        else if (OrderBy == 'Amount Descending'){
            var result = JSON.parse(JSON.stringify(await executeQuery({
                query: 'CALL selectExpenseData_AmountDesc(?, ?)',
                values: [ID, Month],
            })));
        }
        else{
            res.status(500).json({Result:[], totalExpense: totalExpense})
        }
        res.status(200).json({ Result: result[0], totalExpense: totalExpense } )
    };
};