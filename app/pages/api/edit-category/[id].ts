import type { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from '../../../utils/db'
import authorisedValidator from '../../../utils/authorised-validator';

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
        /** check user authorisation */
        await authorisedValidator(req, res);

        /** deconstruct body data */
        const { categoryID, categoryName, categoryColor } = req.body;

        /* insert data into category table */
        const result = await executeQuery({
            query: 'UPDATE category SET Name=?, Color=? WHERE AccountID=? AND ID=?',
            values: [categoryName, categoryColor, req.query.id, categoryID],
        });

        res.status(201).json({ ID: categoryID, Name: categoryName, Color: categoryColor})
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