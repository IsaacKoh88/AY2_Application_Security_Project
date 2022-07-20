import type { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from '../../../utils/db'
import * as jose from 'jose'
import { v4 as uuidv4 } from 'uuid';

type Data = {
    ID: string,
    Name: string,
    Color: string,
}

export default async function EditCategory(
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
                const { categoryID, categoryName, categoryColor } = req.body;

                /* insert data into category table */
                const result = await executeQuery({
                    query: 'UPDATE category SET Name=?, Color=? WHERE AccountID=? AND ID=?',
                    values: [categoryName, categoryColor, resultID[0].id, categoryID],
                });
                console.log(result)

                res.status(201).json({ ID: categoryID, Name: categoryName, Color: categoryColor})
                res.end();
                return
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