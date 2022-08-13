import type { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from '../../../../utils/connections/db'
import authorisedValidator from '../../../../utils/api/authorised-validator';
import getValidator from '../../../../utils/api/get-validator';
import apiErrorHandler from '../../../../utils/api/api-error-handler';
import inputFormat from '../../../../utils/input-format';

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
    try {
        /** check user authorisation */
        await authorisedValidator(req);

        /** check if request is POST */
        await getValidator(req);

        /** validate if request params are correct */
        if (!new inputFormat().validateuuid(req.query.id)) {
            throw 400
        }
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