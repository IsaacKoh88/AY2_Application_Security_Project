import type { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from '../../utils/db'
import * as jose from 'jose'

type Data = {
    message: string
}

export default async function CreateCategoryHandler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    /* accepts only POST requests and non-empty requests */
    if ((req.method == 'POST') && (req.body)) {
        const { categoryName, categoryColor } = req.body;

        const JWTtoken:string = req.cookies['token']!;

         /* if JWT does not exist */
        if (JWTtoken == undefined) {
            res.statusCode = 401;
            res.end('Error');
            return
        }

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

            /* insert data into category table */
            const result = await executeQuery({
                query: 'CALL insertCategoryData(?, ?, ?)',
                values: [resultID[0]['id'], categoryName, categoryColor],
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