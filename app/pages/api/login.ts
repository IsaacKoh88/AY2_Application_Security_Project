import type { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from '../../utils/connections/db';
import postValidator from '../../utils/api/post-validator';
import inputFormat from '../../utils/input-format';
import apiErrorHandler from '../../utils/api/api-error-handler';
import generateJWT from '../../utils/generate-jwt';
import setCookie from '../../utils/api/set-cookie';
import * as argon2 from 'argon2';

const LoginHandler = async (
    req: NextApiRequest,
    res: NextApiResponse
) => {
    try {
        /** check if request is POST */
        await postValidator(req);

        /** validate if request params are correct */
        try {
            if (!new inputFormat().validateemail(req.body.email)) {
                throw 400;
            }
            if (!new inputFormat().validatetext255requried(req.body.password)) {
                throw 400;
            }
        } catch {
            throw 400;
        }
    }
    catch (error) {
        apiErrorHandler(error, res);
        return
    }

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
            return
        }
        else {
            res.status(401).json({ message: 'Incorrect credentials' });
            res.redirect('/login');
            return
        }
    } 
    catch ( error ) {
        res.status(500).json({ message: 'internal server error' })
        res.redirect('/login');
        return
    }
};

export default LoginHandler;