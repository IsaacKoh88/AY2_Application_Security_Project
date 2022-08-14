import type { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from '../../../../utils/connections/db'
import authorisedValidator from '../../../../utils/api/authorised-validator';
import getValidator from '../../../../utils/api/get-validator';
import inputFormat from '../../../../utils/input-format';
import apiErrorHandler from '../../../../utils/api/api-error-handler';
import moment from 'moment';

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

        /** validate if request params are correct */
        if (!new inputFormat().validateuuid(req.query.id)) {
            throw 400;
        };
        try {
            if (!new inputFormat().validatedate(req.query.date)) {
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

    const date = req.query.date;

    try {
        /* insert data into category table */
        const result = JSON.parse(JSON.stringify(await executeQuery({
            query: 'CALL selectEventData_AccountID_Date(?,?)',
            values: [req.query.id, date],
        })));

        res.status(200).json(result[0])
        return
    }
    /** if request body components do not fit requirements */
    catch {
        res.status(500).json({ message: 'Internal server error' })
        return
    }
};

/**
Requires authentication?    yes

Response format             200         json        {ID: string, Name: string, Date: string, StartTime: string, EndTime: string, Description: string, CategoryID: string}[]

Errors
401         unauthenticated
405         request not using POST method

*/