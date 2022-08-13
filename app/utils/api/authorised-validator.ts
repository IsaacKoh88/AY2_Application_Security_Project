import type { NextApiRequest } from "next";
import executeQuery from '../connections/db';
import inputFormat from "../input-format";
import * as jose from 'jose';
import redisClient from '../connections/redis';
import tokenBlacklistCheck from "../check-blacklist-token";

const authorisedValidator = async (
    req: NextApiRequest,
) => {
    try {
        const JWTtoken:string = req.cookies['token']!;

        if (await tokenBlacklistCheck(req.cookies['token']!)) {
            throw 401
        }

        /* check if JWT token is valid, then get the email */
        const email = await jose.jwtVerify(
            JWTtoken, 
            new TextEncoder().encode(`qwertyuiop`), 
            {
                issuer: 'application-security-project'
            })
            .then(value => {return value['payload']['email']});
        
        if (req.query.id) {
            /* get uuid from email */
            const resultID = await executeQuery({
                query: 'select id from account where email = ?',
                values: [email],
            });

            if (resultID[0].id !== req.query.id) {
                throw 403
            }
        }
    } 
    /* reject if JWT token is invalid */
    catch (error) {
        throw 401
    };
};

export default authorisedValidator;