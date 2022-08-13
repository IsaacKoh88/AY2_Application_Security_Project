import type { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from '../../../../utils/connections/db'
import authorisedValidator from '../../../../utils/api/authorised-validator';
import apiErrorHandler from '../../../../utils/api/api-error-handler';
import { v4 as uuidv4 } from 'uuid';

type Data = {
    message: string
}

export default async function CreateExpense(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    /* accepts only POST requests and non-empty requests */
    if ((req.method == 'POST') && (req.body) && (req.cookies['token'])) {
        try {
            /** check user authorisation */
            await authorisedValidator(req);
        }
        catch (error) {
            apiErrorHandler(error, res);
            return
        }

        /** deconstruct body data */
        const { accountID, expenseName, amount, date } = req.body;

        /* validate input */
        const dateregex = /([1-2]?[0][8-9]?[0-9]?[0-9])-(0[0-9]|1[0-2])-(0[1-9]|[1-2]?[0-9]|3[0-1])/
        if (accountID === '' || accountID.length !== 36 || expenseName === '' || expenseName.length >= 255 || amount <= 0 || date === '' || dateregex.test(date)===false){
            res.statusCode = 400;
            res.end('Request format error');
            return
        }

        try {
            var id = uuidv4();
            var idcheck = JSON.parse(JSON.stringify(await executeQuery({
                query: 'SELECT COUNT(*) FROM expense WHERE ID=?',
                values: [id],
            })));
            var totalCount = 1

            while (idcheck[0]['COUNT(*)'] == 1 && totalCount < 100) {              
                id = uuidv4()
                var idcheck = JSON.parse(JSON.stringify(await executeQuery({
                    query: 'SELECT COUNT(*) FROM expense WHERE ID=?',
                    values: [id],
                })));
                totalCount += 1
            }
            if (totalCount >= 100) {
                res.status(500).json({message: 'Too many uuids checked, please try again'})
                return
            }
            else {
                /* insert data into expense table */
                const result = await executeQuery({
                    query: 'CALL insertExpenseData(?, ?, ?, ?, ?)',
                    values: [accountID, id, expenseName, amount, date],
                });

                res.status(201).json({ message: 'success' })
                return
            }
        }
        /** unexpected error */
        catch {
            res.statusCode = 500;
            res.end('Unexpected Error');
        }
    }
    /* rejects requests that are empty */
    else if (!req.body) {
        res.statusCode = 405;
        res.end('Error');
        return
    }
}