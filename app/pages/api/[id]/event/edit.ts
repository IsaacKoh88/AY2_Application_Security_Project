import type { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from '../../../../utils/connections/db'
import authorisedValidator from '../../../../utils/api/authorised-validator';
import apiErrorHandler from '../../../../utils/api/api-error-handler';
import moment from 'moment';

type Data = {
    message: string
}

export default async function EditEvent(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    /* accepts only POST requests and non-empty requests */
    if ((req.method == 'POST') && (req.body) && (req.cookies['token'])) {
        try {
            /** check user authorisation */
            await authorisedValidator(req);
        }
        catch (error) {
            apiErrorHandler(error, res);
            return
        }

        try {
            /** deconstruct body data */
            let { eventID, eventName, date, startTime, endTime, description, categoryId} = req.body;
            if (typeof categoryId !== 'string') {
                categoryId = JSON.stringify(categoryId);
            }

            const timeregex = /^(2[0-3]|[01]?[0-9]):([0-5]?[0-9]):([0-5]?[0-9])$/

            if ((eventName.length <= 255) && (moment(date, 'YYYY-MM-DD', true).isValid()) && (timeregex.test(startTime)) && (timeregex.test(endTime)) && (description.length <= 65535) && (categoryId.length === 36 || categoryId === 'None' || categoryId === '' || categoryId === 'null')) {

                try {
                    const idcheck = JSON.parse(JSON.stringify(await executeQuery({
                        query: 'CALL selectCountEventID(?)',
                        values: [eventID],
                    })));

                    if (idcheck[0][0]['COUNT(*)'] === 1) {
                        /** check category null */
                        if (categoryId === 'None' || categoryId === '' || categoryId === 'null') {
                            categoryId = null
                        }

                        /* insert data into category table */
                        const result = await executeQuery({
                            query: 'CALL updateEvent(?, ?, ?, ?, ?, ?, ?, ?)',
                            values: [req.query.id, eventID, eventName, date, startTime, endTime, description, categoryId],
                        });

                        res.status(201).json({ message: 'success' })
                        return
                    }
                    /** event ID does not exist */
                    else {
                        res.statusCode = 404;
                        res.end('Event not found');
                    }
                }
                /** event ID does not exist */
                catch {
                    res.statusCode = 404;
                    res.end('Event not found');
                }
            }
            /** if request body components do not fit requirements */
            else {
                res.statusCode = 400;
                res.end('Request format error');
            }
        }
        /** if request body components do not fit requirements */
        catch {
            res.statusCode = 400;
            res.end('Request format error');
        }
    }
    /* rejects requests that are empty */
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
}

/**
API request body must follow the structure below

{
    eventID: string         required    (36 character UUID format & must be a valid eventID)
    eventName: string,      required    (between 1 and 255 characters long)
    date: string,           required    (YYYY-MM-DD format)
    startTime: string,      required    (XX:XX:XX format)
    endTime: string,        required    (XX:XX:XX format)
    description: string,    required    (between 0 and 65535 characters long)
    categoryId: string      optional    (36 character UUID format & must be a valid categoryID)
}

Requires authentication?    yes

Response format             201         json        {message: 'success'}

Errors
400         request body not following above structure
401         unauthenticated
404         event not found
405         request not using POST method

*/