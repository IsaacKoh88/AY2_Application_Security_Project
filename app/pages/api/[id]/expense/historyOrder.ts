import type { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from '../../../../utils/connections/db'
import authorisedValidator from '../../../../utils/api/authorised-validator';
import postValidator from '../../../../utils/api/post-validator';
import inputFormat from '../../../../utils/input-format';
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
    try {
        /** check user authorisation */
        await authorisedValidator(req);

        /** check if request is POST */
        await postValidator(req);

        /** validate if request params are correct */
        if (!new inputFormat().validateuuid(req.query.id)) {
            throw 400;
        };
        try {
            if (!new inputFormat().validateuuid(req.body.ID)) {
                throw 400;
            }
        } catch {
            throw 400;
        }
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
};