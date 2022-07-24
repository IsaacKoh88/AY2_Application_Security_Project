import type { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from '../../../../utils/db'
import authorisedValidator from '../../../../utils/authorised-validator';

type Data = {
    ID: string,
    Name: string,
    Color: string
}[]

export default async function GetEvent(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    /* accepts only GET requests and non-empty requests */
    if ((req.method == 'POST') && (req.cookies['token'])) {
        /** check user authorisation */
        await authorisedValidator(req, res);

        /** deconstruct request body */
        const { date } = req.body

        /* insert data into category table */
        const result = JSON.parse(JSON.stringify(await executeQuery({
            query: 'SELECT ID, Name, Date, StartTime, EndTime, Description, CategoryID FROM events WHERE AccountID=? AND Date=?',
            values: [req.query.id, date],
        })));

        res.status(200).json(result)
        res.end('OK');
        return
    };
};