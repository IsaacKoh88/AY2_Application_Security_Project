import type { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from '../../../../utils/db'
import authorisedValidator from '../../../../utils/authorised-validator';
import apiErrorHandler from '../../../../utils/api-error-handler';

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

        /* insert data into category table */
        const result = JSON.parse(JSON.stringify(await executeQuery({
            query: 'CALL selectTodoData_AccountID(?)',
            values: [req.query.id],
        })));

        res.status(200).json(result[0])
        return
    }
    /* rejects requests that are not GET */
    else if (req.method !== 'GET') {
        res.statusCode = 405;
        res.end('Error');
        return
    }
    /** if user is not authenticated */
    else if (!req.cookies['token']) {
        res.statusCode = 401;
        res.end('Unauthorised');
        return
    }
};

/**
Requires authentication?    yes

Response format             200         json        {ID: string, Name: string, Date: string, Checked: number}[]

Errors
401         unauthenticated
405         request not using GET method

*/