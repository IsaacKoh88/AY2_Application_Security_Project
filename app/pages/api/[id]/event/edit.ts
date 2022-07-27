import type { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from '../../../../utils/db'
import authorisedValidator from '../../../../utils/authorised-validator';
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
        /** check user authorisation */
        await authorisedValidator(req, res);

        try {
            /** deconstruct body data */
            let { eventID, eventName, date, startTime, endTime, description, categoryId} = req.body;
            if (typeof categoryId !== 'string') {
                categoryId = JSON.stringify(categoryId);
            }

            const timeregex = /^(2[0-3]|[01]?[0-9]):([0-5]?[0-9]):([0-5]?[0-9])$/

            if ((eventName.length <= 255) && (moment(date, 'YYYY-MM-DD', true).isValid()) && (timeregex.test(startTime)) && (timeregex.test(endTime)) && (description.length <= 65535) && (categoryId.length === 36 || categoryId === 'None' || categoryId === '' || categoryId === 'null')) {

                try {
                    const idcheck = await executeQuery({
                        query: 'SELECT COUNT(*) FROM events WHERE AccountID=? AND ID=?',
                        values: [req.query.id, eventID],
                    });

                    if (idcheck[0]['COUNT(*)'] === 1) {
                        /** check category null */
                        if (categoryId === 'None' || categoryId === '' || categoryId === 'null') {
                            categoryId = null
                        }

                        /* insert data into category table */
                        const result = await executeQuery({
                            query: 'UPDATE events SET Name=?, Date=?, StartTime=?, EndTime=?, Description=?, CategoryID=? WHERE AccountID=? AND ID=?',
                            values: [eventName, date, startTime, endTime, description, categoryId, req.query.id, eventID],
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