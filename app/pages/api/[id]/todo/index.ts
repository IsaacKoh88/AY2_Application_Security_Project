import type { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from '../../../../utils/connections/db'
import authorisedValidator from '../../../../utils/api/authorised-validator';
import getValidator from '../../../../utils/api/get-validator';
import apiErrorHandler from '../../../../utils/api/api-error-handler';

type Data = {
    ID: string,
    Name: string,
    Color: string
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
    }
    catch (error) {
        apiErrorHandler(error, res);
        return
    }

    /* insert data into category table */
    const result = JSON.parse(JSON.stringify(await executeQuery({
        query: 'CALL selectTodoData_AccountID(?)',
        values: [req.query.id],
    })));

    res.status(200).json(result[0])
    return
};

/**
Requires authentication?    yes

Response format             200         json        {ID: string, Name: string, Date: string, Checked: number}[]

Errors
401         unauthenticated
405         request not using GET method

*/