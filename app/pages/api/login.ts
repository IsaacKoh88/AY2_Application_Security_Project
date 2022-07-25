import type { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from '../../utils/db';
import generateJWT from '../../utils/generate-jwt';
import setCookie from '../../utils/set-cookie';
import * as argon2 from 'argon2';

const LoginHandler = async (
    req: NextApiRequest,
    res: NextApiResponse
) => {
    /** accepts only POST requests and non-empty requests */
    if ((req.method == 'POST') && (req.body)) {
        /** deconstructs request body */
        const { email, password } = req.body;

        try {
            /** connects to mysql database and queries it */
            const result = await executeQuery({
                query: 'SELECT id, email, password FROM account WHERE email=?',
                values: [email],
            });

            /** if row exists in database and password is verified */
            if ((result[0] !== undefined) && (await argon2.verify(result[0].password, password))) {
                /** generates jwt token */
                const jwtToken = await generateJWT(email);
                // Calling our pure function using the `res` object, it will add the `set-cookie` header
                setCookie(res, 'token', jwtToken);
                res.redirect(307, ('/account/' + result[0].id));
            }
            else {
                res.statusCode = 401;
                res.end('Email or Password is incorrect');
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