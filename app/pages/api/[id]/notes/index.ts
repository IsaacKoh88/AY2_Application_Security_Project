import type { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from '../../../../utils/db'
import authorisedValidator from '../../../../utils/authorised-validator';
import apiErrorHandler from '../../../../utils/api-error-handler';

type Data = {
    ID: string,
    Name: string,
}[] | {
    message: string
}

export default async function GetEvent(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    /* accepts only GET requests and non-empty requests */
    if ((req.method == 'GET') && (req.cookies['token'])) {
        try {
            /** check user authorisation */
            await authorisedValidator(req);
        }
        catch (error) {
            apiErrorHandler(error, res);
            return
        }

        /* insert data into notes table */
        const result = await executeQuery({
            query: 'SELECT ID, Name FROM notes WHERE AccountID=?',
            values: [req.query.id],
        });

        res.status(200).json(result)
        return
    };
};