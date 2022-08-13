import type { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from '../../utils/connections/db'
import * as argon2 from 'argon2';
import { v4 as uuidv4 } from 'uuid';

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

        try {
            /** hash password */
            const hashedPassword = await argon2.hash(password);

            var id = uuidv4();
            var idcheck = JSON.parse(JSON.stringify(await executeQuery({
                query: 'CALL selectCountAccountID(?)',
                values: [id],
            })));
            var totalCount = 1

            while (idcheck[0][0]['COUNT(*)'] == 1 && totalCount < 100) {              
                id = uuidv4()
                var idcheck = JSON.parse(JSON.stringify(await executeQuery({
                    query: 'CALL selectCountAccountID(?)',
                    values: [id],
                })));
                totalCount += 1
            }
            
            if (totalCount >= 100) {
                res.status(500).json({message: 'Too many uuids checked, please try again'})
                return
            }
            else {
                /* insert data into account table */
                const result = await executeQuery({
                    query: 'CALL insertAccountData(?, ?, ?)',
                    values: [id, email, hashedPassword],
                });
                console.log(result)
                res.status(200);
                res.redirect('/login');
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