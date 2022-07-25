import type { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from '../../../../utils/db'
import authorisedValidator from '../../../../utils/authorised-validator';

type Data = {
    ID: string,
    Name: string,
    Amount: number,
    Date: string
}[]

export default async function GetExpense(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    /* accepts only GET requests and non-empty requests */
    if ((req.method == 'POST') && (req.cookies['token'])) {
        /** check user authorisation */
        await authorisedValidator(req, res);

        /** deconstruct request body */
        const { Month } = req.body;

        /** get expenses */
        const result = JSON.parse(JSON.stringify(await executeQuery({
            query: 'SELECT ID, Name, Amount, DATE_FORMAT(Date, "%Y-%m-%d") Date FROM expense WHERE AccountId = ?',
            values: [req.query.id],
        })));

        res.status(200).json(result);
        res.end('OK');
        return
    };
};