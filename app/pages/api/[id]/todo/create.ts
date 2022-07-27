import type { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from '../../../../utils/db';
import authorisedValidator from '../../../../utils/authorised-validator';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

type Data = {
    message: string
}

export default async function CreateTodo(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    /* accepts only POST requests and non-empty requests */
    if ((req.method == 'POST') && (req.body) && (req.cookies['token'])) {
        /** check user authorisation */
        await authorisedValidator(req, res); 

        try {
            /** deconstruct body data */
            const { todoName, date } = req.body;

            if ((todoName.length <= 255) && (moment(date, 'YYYY-MM-DD', true).isValid())) {
                /** generate uuidv4 */
                const id = uuidv4();

                /* insert data into calendar table */ 
                const result = await executeQuery({
                    query: 'INSERT INTO todo VALUES(?, ?, ?, ?, ?)',
                    values: [req.query.id, id, todoName, date, 0],
                });

                res.status(201).json({ message: 'success' })
                return
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