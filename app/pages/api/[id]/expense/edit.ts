import type { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from '../../../../utils/connections/db'
import authorisedValidator from '../../../../utils/api/authorised-validator';
import postValidator from '../../../../utils/api/post-validator';
import inputFormat from '../../../../utils/input-format';
import apiErrorHandler from '../../../../utils/api/api-error-handler';

type Data = {
    message: string
}

export default async function EditExpense(
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
            if (!new inputFormat().validateuuid(req.body.accountID)) {
                throw 400;
            }
            if (!new inputFormat().validatetext255requried(req.body.expenseName)) {
                throw 400;
            }
            if (!new inputFormat().validateamount(req.body.amount)) {
                throw 400;
            }
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

    /** deconstruct body data */
    const { accountID, id, expenseName, amount, date } = req.body;

    try {
        const totalTodos = JSON.parse(JSON.stringify(await executeQuery({
            query: 'CALL selectTotalExpenses(?, ?)',
            values: [req.query.id, date],
        })));

        if (totalTodos[0][0]['COUNT(*)'] <= 300) {

            try {
                /* update data in expense table */
                const result = await executeQuery({
                    query: 'CALL updateExpense(?, ?, ?, ?, ?)',
                    values: [accountID, id, expenseName, amount, date],
                });

                res.status(201).json({ message: 'success' })
                return
            }
            catch {
                res.status(500).json({ message: 'Internal server error' })
                return
            }

        } else {
            res.status(409).json({ message: 'Too many expenses created for the selected month, please remove some before adding more' });
        }
    }
    catch {
        res.status(500).json({ message: 'Internal server error' })
        return
    }
}