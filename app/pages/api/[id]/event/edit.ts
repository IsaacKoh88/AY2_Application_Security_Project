import type { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from '../../../../utils/connections/db'
import authorisedValidator from '../../../../utils/api/authorised-validator';
import postValidator from '../../../../utils/api/post-validator';
import inputFormat from '../../../../utils/input-format';
import apiErrorHandler from '../../../../utils/api/api-error-handler';
import moment from 'moment';

type Data = {
    message: string
}

export default async function EditEvent(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    try {
        /** check user authorisation */
        await authorisedValidator(req);

        /** check if request is POST */
        await postValidator(req);

        /** validate if request params are correct */
        if (!new inputFormat().validateuuid(req.query.id)) {
            throw 400;
        };
        try {
            if (!new inputFormat().validateuuid(req.body.eventID)) {
                throw 400;
            }
            if (!new inputFormat().validatetext255requried(req.body.eventName)) {
                throw 400;
            }
            if (!new inputFormat().validatetime(req.body.startTime)) {
                throw 400;
            }
            if (!new inputFormat().validatetime(req.body.endTime)) {
                throw 400;
            }
            if (!new inputFormat().validatetextblock(req.body.description)) {
                throw 400;
            }
            if (!new inputFormat().validatedate(req.body.date)) {
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

    let { eventID, eventName, date, startTime, endTime, description, categoryId} = req.body;
    if (typeof categoryId !== 'string') {
        categoryId = JSON.stringify(categoryId);
    }

    const currentDate = new Date() 

    const startDate = new Date(currentDate.getTime());
    startDate.setHours(startTime.split(":")[0]);
    startDate.setMinutes(startTime.split(":")[1]);
    startDate.setSeconds(startTime.split(":")[2]);

    const endDate = new Date(currentDate.getTime());
    endDate.setHours(endTime.split(":")[0]);
    endDate.setMinutes(endTime.split(":")[1]);
    endDate.setSeconds(endTime.split(":")[2]);

    if (startDate < endDate) {
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

                try {
                    /* insert data into category table */
                    const result = await executeQuery({
                        query: 'CALL updateEvent(?, ?, ?, ?, ?, ?, ?, ?)',
                        values: [req.query.id, eventID, eventName, date, startTime, endTime, description, categoryId],
                    });

                    res.status(201).json({ message: 'success' })
                    return
                }
                catch {
                    res.status(500).json({ message: 'Internal server error' })
                    return
                }
            }
            /** event ID does not exist */
            else {
                res.status(404).json({ message: 'Event not found' });
            }
        }
        /** event ID does not exist */
        catch {
            res.status(500).json({ message: 'Internal server error' })
            return
        }
    }
    /** if request body components do not fit requirements */
    else {
        res.status(400).json({ message: 'Bad Request' });
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