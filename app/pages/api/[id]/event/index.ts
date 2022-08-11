import type { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from '../../../../utils/db'
import authorisedValidator from '../../../../utils/authorised-validator';
import moment from 'moment';

type Data = {
    ID: string,
    Name: string,
    Color: string
}[]

export default async function GetEvent(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    /* accepts only GET requests and non-empty requests */
    if ((req.method == 'POST') && (req.body) && (req.cookies['token'])) {
        /** check user authorisation */
        await authorisedValidator(req, res);

        try {
            /** deconstruct request body */
            const { date } = req.body

            if (moment(date, 'YYYY-MM-DD', true).isValid()) {

                /* insert data into category table */
                const result = JSON.parse(JSON.stringify(await executeQuery({
                    query: 'CALL selectEventData_AccountID_Date(?,?)',
                    values: [req.query.id, date],
                })));

                res.status(200).json(result[0])
                return
            }
        }
        /** if request body components do not fit requirements */
        catch {
            res.statusCode = 400;
            res.end('Request format error');
        }
    }
    /* rejects requests that are not POST */
    else if (req.method !== 'POST') {
        res.statusCode = 405;
        res.end('Error');
        return
    }
    /** if request body components do not fit requirements */
    else if (!req.body) {
        res.statusCode = 400;
        res.end('Request format error');
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

Response format             200         json        {ID: string, Name: string, Date: string, StartTime: string, EndTime: string, Description: string, CategoryID: string}[]

Errors
401         unauthenticated
405         request not using GET method

*/