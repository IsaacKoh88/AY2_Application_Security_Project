import type { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import executeQuery from '../../db/db';
import { useCookies } from "react-cookie"


const KEY = 'qwertyuiop'


type Data = {
    token: string
}

export default async function LoginHandler(
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
                query: 'SELECT email FROM account WHERE email=? AND password=?',
                values: [email, password],
            });
            if (result[0] !== undefined) {
                res.status(200).json({
                    token: jwt.sign({
                        email
                    }, KEY)
                })
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
    }
}