import type { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from '../../utils/db'
import * as jose from 'jose'

type Data = {
    message: string
}

export default async function CreateTodoHandler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    /* accepts only POST requests and non-empty requests */
    if ((req.method == 'POST') && (req.body)) {
        const { todoName, date } = req.body;

        const JWTtoken:string = req.cookies['token']!;

         /* if JWT does not exist */
        if (JWTtoken == undefined) {
            res.statusCode = 401;
            res.end('Error');
            return
        }

        try {
            /* check if JWT token is valid, then get the emaild */
            const email = await jose.jwtVerify(JWTtoken, new TextEncoder()
                        .encode(`qwertyuiop`))
                        .then(value => {return value['payload']['email']});
            
            /* cget uuid from email */ 
            const resultID = await executeQuery({
                query: 'select id from account where email = ?',
                values: [email],
            });

            /* insert data into todo table */
            const result = await executeQuery({
                query: 'insert into todo values(?, ?, ?)',
                values: [resultID[0]['id'], todoName, date],
            });

            res.status(200).json({ message: 'success'})
        } 
        /* reject if JWT token is invalid */
        catch (error) {
            res.statusCode = 403;
            res.end('Error');
            return
        }    
    }
    /* rejects requests that are empty */
    else if (!req.body) {
        res.statusCode = 405;
        res.end('Error');
        return
    }
}