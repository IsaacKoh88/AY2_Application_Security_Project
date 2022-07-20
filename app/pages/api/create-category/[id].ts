import type { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from '../../../utils/db'
import authorisedValidator from '../../../utils/authorised-validator';
import * as jose from 'jose'
import { v4 as uuidv4 } from 'uuid';

type Data = {
    ID: string,
    Name: string,
    Color: string,
}

export default async function CreateCategory(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    /* accepts only POST requests and non-empty requests */
    if ((req.method == 'POST') && (req.body) && (req.cookies['token'])) {
        /** check user authorisation */
        await authorisedValidator(req, res);

        /** deconstruct body data */
        const { categoryName, categoryColor } = req.body;

        /** generate uuidv4 */
        const id = uuidv4();

        /* insert data into category table */
        const result = await executeQuery({
            query: 'INSERT INTO category VALUES(?, ?, ?, ?)',
            values: [req.query.id, id, categoryName, categoryColor],
        });

        res.status(201).json({ ID: id, Name: categoryName, Color: categoryColor})
        res.end();
        return
    }
    /* rejects requests that are empty */
    else if (!req.body) {
        res.statusCode = 405;
        res.end('Error');
        return
    }
}