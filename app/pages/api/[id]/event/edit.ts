import type { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from '../../../../utils/db'
import authorisedValidator from '../../../../utils/authorised-validator';

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

        /** deconstruct body data */
        const { eventID, eventName, date, startTime, endTime, description, categoryId} = req.body;

        /* insert data into category table */
        const result = await executeQuery({
            query: 'UPDATE events SET Name=?, Date=?, StartTime=?, EndTime=?, Description=?, CategoryID=? WHERE AccountID=? AND ID=?',
            values: [eventName, date, startTime, endTime, description, categoryId, req.query.id, eventID],
        });

        res.status(201).json({ message: 'success' })
        res.end();
        return
    }
    /* rejects requests that are empty */
    else if (!req.body) {
        res.statusCode = 405;
        res.end('Error');
        return
    }
}