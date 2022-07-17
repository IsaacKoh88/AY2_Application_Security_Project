import type { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from '../../utils/db'
import * as jose from 'jose'

type Data = {
    message: string
}

export default async function ChangePasswordHandler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    /* accepts only POST requests and non-empty requests */
    if ((req.method == 'POST') && (req.body)) {
        /* deconstructs request body */
        const { id, password } = req.body;

        const JWTtoken:string = req.cookies['token']!;

        /* if JWT does not exist */
        if (JWTtoken == undefined) {
            res.statusCode = 401;
            res.end('Error');
            return
        }

        /* if JWT exist */
        try {
            /* check if JWT token is valid */
            const email = await jose.jwtVerify(JWTtoken, new TextEncoder()
                        .encode(`qwertyuiop`))
                        .then(value => {return value['payload']['email']});
                        
            /* connects to mysql database and queries it */ 
            const result = await executeQuery({
                query: 'UPDATE account SET password=? WHERE id=? AND email=?',
                values: [password, id, email],
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
    /* rejects requests that are not POST */
    else if (req.method != 'POST') {
        res.statusCode = 405;
        res.end('Error');
        return
    }
    /* rejects requests that are empty */
    else if (!req.body) {
        res.statusCode = 405;
        res.end('Error');
        return
    }
}