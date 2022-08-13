import type { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from '../../../../utils/db';
import authorisedValidator from '../../../../utils/authorised-validator';
import apiErrorHandler from '../../../../utils/api-error-handler';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

type Data = {
    message: string
}

export default async function CreateEvent(
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
            let { eventName, date, startTime, endTime, description, categoryId} = req.body;
            if (typeof categoryId !== 'string') {
                categoryId = JSON.stringify(categoryId);
            }

            const timeregex = /^(2[0-3]|[01]?[0-9]):([0-5]?[0-9]):([0-5]?[0-9])$/

            if ((eventName.length <= 255) && (moment(date, 'YYYY-MM-DD', true).isValid()) && (timeregex.test(startTime)) && (timeregex.test(endTime)) && (description.length <= 65535) && (categoryId.length === 36 || categoryId === 'None' || categoryId === '' || categoryId === 'null')) {
                try {
                    const totalEvents = JSON.parse(JSON.stringify(await executeQuery({
                        query: 'CALL selectTotalEvents(?, ?)',
                        values: [req.query.id, date],
                    })));

                    if (totalEvents[0][0]['COUNT(*)'] < 50) {

                        var id = uuidv4();
                        var idcheck = JSON.parse(JSON.stringify(await executeQuery({
                            query: 'CALL selectCountEventID(?)',
                            values: [id],
                        })));
                        var totalCount = 1
            
                        while (idcheck[0][0]['COUNT(*)'] == 1 && totalCount < 100) {              
                            id = uuidv4()
                            var idcheck = JSON.parse(JSON.stringify(await executeQuery({
                                query: 'CALL selectCountEventID(?)',
                                values: [id],
                            })));
                            totalCount += 1
                        }

                        if (totalCount >= 100) {
                            res.status(500).json({message: 'Too many uuids checked, please try again'})
                            return
                        }
                        else {
                            /** check category null */
                            if (categoryId === 'None' || categoryId === '' || categoryId === 'null') {
                                /* insert data into calendar table */ 
                                categoryId = null
                            } 
                            /* insert data into calendar table */ 
                            const result = await executeQuery({
                                query: 'CALL insertEventData(?, ?, ?, ?, ?, ?, ?, ?)',
                                values: [req.query.id, id, eventName, date, startTime, endTime, description, categoryId],
                            });
                
                            res.status(201).json({ message: 'success' })
                            return
                        }
                    }
                    /** more than 50 events */
                    else {
                        res.statusCode = 304;
                        res.end('You have reached the limit of 50 events that day, please remove some events before adding more');
                    }
                }
                /** unexpected error */
                catch {
                    res.statusCode = 500;
                    res.end('Unexpected Error');
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
}

/**
API request body must follow the structure below

{
    eventName: string,      required    (between 1 and 255 characters long)
    date: string,           required    (YYYY-MM-DD format)
    startTime: string,      required    (XX:XX:XX format)
    endTime: string,        required    (XX:XX:XX format)
    description: string,    required    (between 0 and 65535 characters long)
    categoryId: string      optional    (36 character UUID format)
}

Requires authentication?    yes

Response format             201         json        {message: 'success'}

Errors
304         limit of 50 events per day has been reached for that day
400         request body not following above structure
401         unauthenticated
405         request not using POST method
500         unexpected server error

*/