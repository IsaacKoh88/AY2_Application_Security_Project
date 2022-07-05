import type { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from '../../utils/db';
import setCookie from '../../utils/set-cookie';
import * as jose from 'jose'

const LoginHandler = async (
    req: NextApiRequest,
    res: NextApiResponse
) => {
    /** accepts only POST requests and non-empty requests */
    if ((req.method == 'POST') && (req.body)) {
        /** deconstructs request body */
        const { email, password } = req.body;
        
        const jwtToken = await new jose.SignJWT({ email: email })
                        .setProtectedHeader({ alg: 'HS256' })
                        .setIssuedAt()
                        .setExpirationTime('30d')
                        .sign(new TextEncoder().encode(`qwertyuiop`))
                        .then(value => {return value});

        /** connects to mysql database and queries it */
        try {
            const result = await executeQuery({
                query: 'SELECT email FROM account WHERE email=? AND password=?',
                values: [email, password],
            });
            if (result[0] !== undefined) {
                res.status(200);
                // Calling our pure function using the `res` object, it will add the `set-cookie` header
                setCookie(res, 'token', jwtToken)
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