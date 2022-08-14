import type { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from '../../../../utils/connections/db'
import authorisedValidator from '../../../../utils/api/authorised-validator';
import postValidator from '../../../../utils/api/post-validator';
import inputFormat from '../../../../utils/input-format';
import apiErrorHandler from '../../../../utils/api/api-error-handler';
import { encrypt } from '../../../../utils/encryption.js';


type Data = {
    message: string
}

export default async function EditAccount(
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
            if (!new inputFormat().validatetext255requried(req.body.username)) {
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

    /** deconstruct body data */
    const { id, username, address, image } = req.body;

    /**encrypts address before sending to database */
    const encryptedAddr = encrypt(address)

    try {
        const result = JSON.parse(JSON.stringify(await executeQuery({
            query: 'CALL updateAccountInfo(?, ?, ?, ?)',
            values: [id, username, encryptedAddr, image],
        })));
    
    
        res.status(200).json(result)
        return
    }
    catch {
        res.status(500).json({ message: 'Internal server error' })
        return
    }
}
