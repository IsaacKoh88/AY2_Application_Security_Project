import type { NextApiRequest, NextApiResponse } from "next";
import executeQuery from './db';
import * as jose from 'jose';

const authorisedValidator = async (
    req: NextApiRequest,
    res: NextApiResponse,
) => {
    const JWTtoken:string = req.cookies['token']!;

    try {
        /* check if JWT token is valid, then get the email */
        const email = await jose.jwtVerify(JWTtoken, new TextEncoder()
                    .encode(`qwertyuiop`))
                    .then(value => {return value['payload']['email']});
        
        /* get uuid from email */
        const resultID = await executeQuery({
            query: 'select id from account where email = ?',
            values: [email],
        });

        if (resultID[0].id !== req.query.id) {
            res.statusCode = 403;
            res.end('Error');
            return
        }
    } 
    /* reject if JWT token is invalid */
    catch (error) {
        res.statusCode = 403;
        res.end('Error');
        return
    };
};

export default authorisedValidator;