import type { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from '../../../../utils/connections/db'
import authorisedValidator from '../../../../utils/api/authorised-validator';
import getValidator from '../../../../utils/api/get-validator';
import inputFormat from '../../../../utils/input-format';
import apiErrorHandler from '../../../../utils/api/api-error-handler';

type Data = {
    ID: string,
    Name: string,
    Color: string
}[] | {
    message: string
}

export default async function GetCategory(
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
            throw 400;
        };
    }
    catch (error) {
        apiErrorHandler(error, res);
        return
    }

    try {
        /* get data from table */
        const result = JSON.parse(JSON.stringify(await executeQuery({
            query: 'CALL selectCategoryData_AccountID(?)',
            values: [req.query.id],
        })));

        res.status(200).json(result[0])
        return
    }
    catch {
        res.status(500).json({ message: 'Internal server error' })
        return
    }
};

/**
Requires authentication?    yes

Response format             200         json        {ID: string, Name: string, Color: string}[]

Errors
401         unauthenticated
405         request not using GET method

*/