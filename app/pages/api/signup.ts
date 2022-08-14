import type { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from '../../utils/connections/db'
import postValidator from '../../utils/api/post-validator';
import inputFormat from '../../utils/input-format';
import apiErrorHandler from '../../utils/api/api-error-handler';
import * as argon2 from 'argon2';
import { v4 as uuidv4 } from 'uuid';

type Data = {
    message: string
}

export default async function SignupHandler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    try {
        /** check if request is POST */
        await postValidator(req);

        /** validate if request params are correct */
        try {
            if (!new inputFormat().validatetext255requried(req.body.username)) {
                throw 400;
            }
            if (!new inputFormat().validateemail(req.body.email)) {
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

    /** deconstructs request body */
    const { username, email, password } = req.body;

    /** hash password */
    const hashedPassword = await argon2.hash(password);

    try {
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
                query: 'CALL insertAccountData(?, ?, ?, ?)',
                values: [id, username, email, hashedPassword],
            });
            console.log(result)
            res.status(200);
            res.redirect('/login');
        }
    }
    catch ( error ) {
        res.status(500).json({ message: 'internal server error' })
        return
    }
}