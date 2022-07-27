import type { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from '../../../../utils/db'
import authorisedValidator from '../../../../utils/authorised-validator';

type Data = {
    ID: string,
    Name: string,
    Color: string
}[]

export default async function GetCategory(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    /* accepts only GET requests and non-empty requests */
    if ((req.method == 'GET') && (req.cookies['token'])) {
        /** check user authorisation */
        await authorisedValidator(req, res);

        /* get data from table */
        const result = JSON.parse(JSON.stringify(await executeQuery({
            query: 'SELECT ID, Name, Color FROM category WHERE AccountID=? LIMIT 50',
            values: [req.query.id],
        })));

        res.status(200).json(result)
        return
    }
    /* rejects requests that are not GET */
    else if (req.method !== 'GET') {
        res.statusCode = 405;
        res.end('Error');
        return
    }
    /** if user is not authenticated */
    else if (!req.cookies['token']) {
        res.statusCode = 401;
        res.end('Unauthorised');
        return
    }
};