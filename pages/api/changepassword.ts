import type { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from '../../utils/db'

type Data = {
    message: string
}

export default async function ChangePasswordHandler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    /** accepts only POST requests and non-empty requests */
    if ((req.method == 'POST') && (req.body)) {
        /** deconstructs request body */
        const { id, password } = req.body;

        /** connects to mysql database and queries it */
        const result = await executeQuery({
            query: 'UPDATE account SET password=? WHERE id=?',
            values: [password, id],
        });
        res.status(200).json({ message: 'success'})
    }
    /** rejeccts requests that are not POST */
    else if (req.method != 'POST') {
        res.statusCode = 405;
        res.end('Error');
        return
    }
    /** rejects requests that are empty */
    else if (!req.body) {
        res.statusCode = 405;
        res.end('Error');
        return
    }
}