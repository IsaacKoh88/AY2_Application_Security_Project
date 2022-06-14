import type { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from '../../db/db'

type Data = {
    message: string
}

export default async function SignupHandler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    /** accepts only POST requests and non-empty requests */
    if ((req.method == 'POST') && (req.body)) {
        /** deconstructs request body */
        const { email, password } = req.body;

        /** connects to mysql database and queries it */
        try {
            const result = await executeQuery({
                query: 'CALL insertdata(?, ?)',
                values: [email, password],
            });
            res.status(200).json({ message: 'success'})
        } 
        catch ( error ) {
            console.log( error );
        }
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