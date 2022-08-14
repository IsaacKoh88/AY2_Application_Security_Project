import type { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from '../../../../utils/connections/db'
import authorisedValidator from '../../../../utils/api/authorised-validator';
import postValidator from '../../../../utils/api/post-validator';
import inputFormat from '../../../../utils/input-format';
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
            if (!new inputFormat().validatedate(req.body.date)) {
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

    /** deconstruct request body */
    const { date } = req.body;

    try {
        /** get expenses */
        const result = JSON.parse(JSON.stringify(await executeQuery({
            query: 'CALL selectExpenseData_DateDesc(?, ?)',
            values: [req.query.id, date],
        })));

        res.status(200).json(result[0]);
        return
    }
    catch {
        res.status(500).json({ message: 'Internal server error' })
        return
    }
};