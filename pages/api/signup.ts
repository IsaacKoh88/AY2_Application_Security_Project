import type { NextApiRequest, NextApiResponse } from 'next'
import { OkPacket, QueryError } from 'mysql2';
import connection from '../../db/db'

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
        const sql = 'INSERT INTO account (email, password) VALUES ("' + email + '", "' + password + '")'
        connection.execute(sql, function (error: QueryError, result: OkPacket) {
            if (error) throw error;
            console.log(result)
            res.status(200).json({ message: 'success'})
        })
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