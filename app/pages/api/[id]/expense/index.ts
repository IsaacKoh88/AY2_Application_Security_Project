import type { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from '../../../../utils/connections/db'
import authorisedValidator from '../../../../utils/api/authorised-validator';
import apiErrorHandler from '../../../../utils/api/api-error-handler';

type Data = {
    ID: string,
    Name: string,
    Amount: number,
    Date: string
}[] | {
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

        /** deconstruct request body */
        const { date } = req.body;

        /** get expenses */
        const result = JSON.parse(JSON.stringify(await executeQuery({
            query: 'CALL selectExpenseData_Month(?, ?)',
            values: [req.query.id, date],
        })));

        res.status(200).json(result[0]);
        return
    };
};