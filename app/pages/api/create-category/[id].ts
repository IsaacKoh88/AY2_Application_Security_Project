import type { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from '../../../utils/db'
import * as jose from 'jose'
import { uuid } from 'uuidv4'

type Data = {
    message: string
}

export default async function CreateCategoryHandler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    /* accepts only POST requests and non-empty requests */
    if ((req.method == 'POST') && (req.body) && (req.cookies['token'])) {
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

            if (resultID[0].id === req.query.id) {
                /** deconstruct body data */
                const { categoryName, categoryColor } = req.body;

                /** generate uuidv4 */
                const id = uuid();

                /* insert data into category table */
                const result = await executeQuery({
                    query: 'INSERT INTO category VALUES(?, ?, ?, ?)',
                    values: [resultID[0].id, id, categoryName, categoryColor],
                });

                res.status(201).json({ message: 'New category created'})
            }
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