import type { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from '../../../../utils/connections/db';
import authorisedValidator from '../../../../utils/api/authorised-validator';
import apiErrorHandler from '../../../../utils/api/api-error-handler';
import { v4 as uuidv4 } from 'uuid';

type Data = {
    message: string
}

export default async function CreateNotes(
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

        /** generate base data */
        const notesName = 'Untitled';
        const description = '';

        try {
            const totalEvents = JSON.parse(JSON.stringify(await executeQuery({
                query: 'CALL selectTotalNotes(?)',
                values: [req.query.id],
            })));

            if (totalEvents[0][0]['COUNT(*)'] < 50) {
                var id = uuidv4();
                var idcheck = JSON.parse(JSON.stringify(await executeQuery({
                    query: 'CALL selectCountNoteID(?)',
                    values: [id],
                })));
                var totalCount = 1

                while (idcheck[0][0]['COUNT(*)'] == 1 && totalCount < 100) {              
                    id = uuidv4()
                    var idcheck = JSON.parse(JSON.stringify(await executeQuery({
                        query: 'CALL selectCountNoteID(?)',
                        values: [id],
                    })));
                    totalCount += 1
                }
                
                if (totalCount >= 100) {
                    res.status(500).json({message: 'Too many uuids checked, please try again'})
                    return
                }
                else {
                    /* insert data into notes table */
                    const result = await executeQuery({
                        query: 'CALL insertNotesData(?, ?, ?, ?)',
                        values: [req.query.id, id, notesName, description],
                    });

                    res.status(201).json({ message: 'success' })
                    return
                }
            }
        }
        catch (error) {
            res.status(500)
            return
        }
    }
    /* rejects requests that are empty */
    else if (!req.body) {
        res.statusCode = 405;
        return
    }
}