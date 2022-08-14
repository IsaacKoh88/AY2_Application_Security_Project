import type { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from '../../../../utils/connections/db'
import authorisedValidator from '../../../../utils/api/authorised-validator';
import postValidator from '../../../../utils/api/post-validator';
import inputFormat from '../../../../utils/input-format';
import apiErrorHandler from '../../../../utils/api/api-error-handler';
import * as jose from 'jose';
import * as argon2 from 'argon2';

type Data = {
    message: string
}

export default async function ChangePasswordHandler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    try {
        /** check user authorisation */
        await authorisedValidator(req);

        /** check if request is POST */
        await postValidator(req);

        /** validate if request params are correct */
        if (!new inputFormat().validateuuid(req.query.id)) {
            throw 400;
        };
        try {
            if (!new inputFormat().validateuuid(req.body.id)) {
                throw 400;
            }
            if (!new inputFormat().validatetext255requried(req.body.password)) {
                throw 400;
            }
        } catch {
            throw 400;
        }
    }
    catch (error) {
        apiErrorHandler(error, res);
        return
    }

    /* deconstructs request body */
    const { id, password } = req.body;

    try {
        const email = await jose.jwtVerify(req.cookies['token']!, new TextEncoder()
                    .encode(`qwertyuiop`))
                    .then(value => {return value['payload']['email']});

        /* Hashes password */
        const hashedPassword = await argon2.hash(password);

        /* connects to mysql database and queries it */ 
        const result = await executeQuery({
            query: 'CALL updateAccountPassword(?, ?, ?)',
            values: [hashedPassword, id, email],
        });
        res.status(200).json({ message: 'success'})
        return
    } 
    catch {
        res.status(500).json({ message: 'Internal server error' })
        return
    }
}