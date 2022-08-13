import type { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from '../../../../utils/db'
import authorisedValidator from '../../../../utils/authorised-validator';
import apiErrorHandler from '../../../../utils/api-error-handler';

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
                query: 'select ID, Name, Amount, DATE_FORMAT(Date, "%Y-%m-%d") Date from expense where AccountId = ? AND DATE_FORMAT(Date, "%m-%y")=DATE_FORMAT(?, "%m-%y") order by Date, Name, Amount',
                values: [ID, Month],
            })));
        }
        else if (OrderBy == 'Date Descending'){
            var result = JSON.parse(JSON.stringify(await executeQuery({
                query: 'select ID, Name, Amount, DATE_FORMAT(Date, "%Y-%m-%d") Date from expense where AccountId = ? AND DATE_FORMAT(Date, "%m-%y")=DATE_FORMAT(?, "%m-%y") order by Date desc, Name, Amount',
                values: [ID, Month],
            })));
        }
        else if (OrderBy == 'Name Ascending'){
            var result = JSON.parse(JSON.stringify(await executeQuery({
                query: 'select ID, Name, Amount, DATE_FORMAT(Date, "%Y-%m-%d") Date from expense where AccountId = ? AND DATE_FORMAT(Date, "%m-%y")=DATE_FORMAT(?, "%m-%y") order by Name, Date, Amount',
                values: [ID, Month],
            })));
        }
        else if (OrderBy == 'Name Descending'){
            var result = JSON.parse(JSON.stringify(await executeQuery({
                query: 'select ID, Name, Amount, DATE_FORMAT(Date, "%Y-%m-%d") Date from expense where AccountId = ? AND DATE_FORMAT(Date, "%m-%y")=DATE_FORMAT(?, "%m-%y") order by Name desc, Date, Amount',
                values: [ID, Month],
            })));
        }
        else if (OrderBy == 'Amount Ascending'){
            var result = JSON.parse(JSON.stringify(await executeQuery({
                query: 'select ID, Name, Amount, DATE_FORMAT(Date, "%Y-%m-%d") Date from expense where AccountId = ? AND DATE_FORMAT(Date, "%m-%y")=DATE_FORMAT(?, "%m-%y") order by Amount, Date, Name',
                values: [ID, Month],
            })));
        }
        else if (OrderBy == 'Amount Descending'){
            var result = JSON.parse(JSON.stringify(await executeQuery({
                query: 'select ID, Name, Amount, DATE_FORMAT(Date, "%Y-%m-%d") Date from expense where AccountId = ? AND DATE_FORMAT(Date, "%m-%y")=DATE_FORMAT(?, "%m-%y") order by Amount desc, Date, Name',
                values: [ID, Month],
            })));
        }
        else{
            res.status(500).json({Result:[], totalExpense: totalExpense})
        }
        res.status(200).json({ Result: result, totalExpense: totalExpense } )
    };
};