import type { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from '../../utils/db'
import * as argon2 from 'argon2';

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

        try {
            /** hash password */
            const hashedPassword = await argon2.hash(password);

            /** connects to mysql database and queries it */            
            const result = await executeQuery({
                query: 'CALL insertAccountData(?, ?, ?, ?, ?)',
                values: [email, hashedPassword, null, null, null],
            });
            console.log(result)
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