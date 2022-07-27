import type { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from '../../../../utils/db';
import authorisedValidator from '../../../../utils/authorised-validator';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

type Data = {
    message: string
}

type Input = {
    eventName: string,
    date: string
    startTime: string,
    endTime: string,
    description: string,
    categoryId: string
}

export default async function CreateEvent(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    /* accepts only POST requests and non-empty requests */
    if ((req.method == 'POST') && (req.body) && (req.cookies['token'])) {
        /** check user authentication and authorisation */
        await authorisedValidator(req, res); 

        try {
            /** deconstruct body data */
            let { eventName, date, startTime, endTime, description, categoryId} = req.body;
            if (typeof categoryId !== 'string') {
                categoryId = JSON.stringify(categoryId);
            }

            const timeregex = /^(2[0-3]|[01]?[0-9]):([0-5]?[0-9]):([0-5]?[0-9])$/

            if ((eventName.length <= 255) && (moment(date, 'YYYY-MM-DD', true).isValid()) && (timeregex.test(startTime)) && (timeregex.test(endTime)) && (Date(endTime) > Date(startTime)) && (description.length <= 65535) && (categoryId.length === 36 || categoryId === 'None' || categoryId === '' || categoryId === 'null')) {
                /** generate uuidv4 */
                const id = uuidv4();

                /** check category null */
                if (categoryId === 'None' || categoryId === '' || categoryId === 'null') {
                    /* insert data into calendar table */ 
                    categoryId = null
                } 
                /* insert data into calendar table */ 
                const result = await executeQuery({
                    query: 'INSERT INTO events VALUES(?, ?, ?, ?, ?, ?, ?, ?)',
                    values: [req.query.id, id, eventName, date, startTime, endTime, description, categoryId],
                });

                res.status(201).json({ message: 'success' })
                return
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