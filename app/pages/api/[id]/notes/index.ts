import type { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from '../../../../utils/db'
import authorisedValidator from '../../../../utils/authorised-validator';

type Data = {
    ID: string,
    Name: string,
}[]

export default async function GetEvent(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    /* accepts only GET requests and non-empty requests */
    if ((req.method == 'GET') && (req.cookies['token'])) {
        /** check user authorisation */
        await authorisedValidator(req, res);

        /* insert data into notes table */
        const result = JSON.parse(JSON.stringify(await executeQuery({
            query: 'CALL selectNoteName_AccountID(?)',
            values: [req.query.id],
        })));

        res.status(200).json(result[0])
        return
    };
};