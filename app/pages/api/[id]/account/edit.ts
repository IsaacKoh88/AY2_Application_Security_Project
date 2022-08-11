import type { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from '../../../../utils/db'
import authorisedValidator from '../../../../utils/authorised-validator';
import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';
import * as jose from 'jose';
import * as argon2 from 'argon2';
import multer from 'multer';
//import axios, { AxiosRequestConfig } from 'axios';
import CryptoJS from 'crypto-js';
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
        /** check user authorisation */
        await authorisedValidator(req, res);

        /** deconstruct body data */
        const { id, username, address, image } = req.body;

        /**encrypts address before sending to database */
        const encryptedAddr = encrypt(address)

        const result = await executeQuery({
            query: 'UPDATE account SET username=?, address=?, image=? WHERE id=?',
            values: [username, encryptedAddr, image, id],
        });


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
