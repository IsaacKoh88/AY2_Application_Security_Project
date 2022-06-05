import type { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import { OkPacket, QueryError } from 'mysql2';
import connection from '../../db/db'

const KEY = 'qwertyuiop'

type Data = {
    token: string
}

export default function LoginHandler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    /** accepts only POST requests and non-empty requests */
    if ((req.method == 'POST') && (req.body)) {
        /** deconstructs request body */
        const { email, password } = req.body;

        /** connects to mysql database and queries it */
        const sql = 'SELECT email FROM account WHERE email="' + email + '" AND password="' + password + '"'
        connection.execute(sql, function (error: QueryError, result: OkPacket) {
            if (error) throw error;
            console.log(result)
            /** NOTE: DOES NOT VALIDATE IF USER CREDENTIALS ARE CORRECT BUT STILL GIVES A TOKEN */
            res.status(200).json({
                token: jwt.sign({
                    email,
                    password
                }, KEY)
            })
        })

        res.json
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