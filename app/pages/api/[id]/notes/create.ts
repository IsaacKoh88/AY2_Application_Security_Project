import type { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from '../../../../utils/connections/db';
import authorisedValidator from '../../../../utils/api/authorised-validator';
import postValidator from '../../../../utils/api/post-validator';
import apiErrorHandler from '../../../../utils/api/api-error-handler';
import inputFormat from '../../../../utils/input-format';
import { v4 as uuidv4 } from 'uuid';

type Data = {
    message: string
}

export default async function CreateNotes(
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
            throw 400
        }
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

        if (totalEvents[0][0]['COUNT(*)'] <= 50) {
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
        else {
            res.status(409).json({ message: 'Too many notes created, please delete some.' })
        }
    }
    catch (error) {
        res.status(500)
        return
    }
}