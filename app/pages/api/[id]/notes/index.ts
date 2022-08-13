import type { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from '../../../../utils/connections/db'
import authorisedValidator from '../../../../utils/api/authorised-validator';
import apiErrorHandler from '../../../../utils/api/api-error-handler';

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
        const result = JSON.parse(JSON.stringify(await executeQuery({
            query: 'CALL selectNoteName_AccountID(?)',
            values: [req.query.id],
        })));

        res.status(200).json(result[0])
        return
    };
};