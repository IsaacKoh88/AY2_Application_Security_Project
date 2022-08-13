import type { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from '../../../../utils/db'
import authorisedValidator from '../../../../utils/authorised-validator';
import apiErrorHandler from '../../../../utils/api-error-handler';
import { encrypt } from '../../../../utils/encryption.js';


type Data = {
    message: string
}

export default async function EditAccount(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    /* accepts only POST requests and non-empty requests */
    if ((req.method == 'POST') && (req.body) && (req.cookies['token'])) {
        try {
            /** check user authorisation */
            await authorisedValidator(req);
        }
        catch (error) {
            apiErrorHandler(error, res);
            return
        }

        /** deconstruct body data */
        const { id, username, address, image } = req.body;

        /**encrypts address before sending to database */
        const encryptedAddr = encrypt(address)

        const result = JSON.parse(JSON.stringify(await executeQuery({
            query: 'CALL updateAccountInfo(?, ?, ?, ?)',
            values: [id, username, encryptedAddr, image],
        })));


        res.status(200).json(result)
        return

    }
    /* rejects requests that are empty */
    else if (!req.body) {
        res.statusCode = 405;
        res.end('Error');
        return
    }
}
