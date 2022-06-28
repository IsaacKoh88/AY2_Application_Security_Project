import type { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from '../../utils/db';
import generateToken from '../../utils/generate-token';
import setCookie from '../../utils/set-cookie';

const LoginHandler = async (
    req: NextApiRequest,
    res: NextApiResponse
) => {
    /** accepts only POST requests and non-empty requests */
    if ((req.method == 'POST') && (req.body)) {
        /** deconstructs request body */
        const { email, password } = req.body;

        /** connects to mysql database and queries it */
        try {
            const result = await executeQuery({
                query: 'SELECT email FROM account WHERE email=? AND password=?',
                values: [email, password],
            });
            if (result[0] !== undefined) {
                res.status(200);
                // Calling our pure function using the `res` object, it will add the `set-cookie` header
                setCookie(res, 'token', generateToken(email))
                res.end('OK');
            }
            else {
                res.statusCode = 405;
                res.end('Error');
                return
            }
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
    };
};

export default LoginHandler;