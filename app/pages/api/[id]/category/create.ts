import type { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from '../../../../utils/connections/db'
import authorisedValidator from '../../../../utils/api/authorised-validator';
import postValidator from '../../../../utils/api/post-validator';
import inputFormat from '../../../../utils/input-format';
import apiErrorHandler from '../../../../utils/api/api-error-handler';
import { v4 as uuidv4 } from 'uuid';

type Data = {
    message: string
}

export default async function CreateCategory(
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
            if (!new inputFormat().validatetext255requried(req.body.categoryName)) {
                throw 400;
            }
            if (!new inputFormat().validatecolor(req.body.categoryColor)) {
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

    /** deconstruct body data */
    const { categoryName, categoryColor } = req.body;

    try {
        const totalCategories = JSON.parse(JSON.stringify(await executeQuery({
            query: 'CALL selectTotalCategories(?)',
            values: [req.query.id],
        })));

        if (totalCategories[0][0]['COUNT(*)'] < 50) {

            var id = uuidv4();
            var idcheck = JSON.parse(JSON.stringify(await executeQuery({
                query: 'CALL selectCountCategoryID(?)',
                values: [id],
            })));
            var totalCount = 1

            while (idcheck[0][0]['COUNT(*)'] == 1 && totalCount < 100) {              
                id = uuidv4()
                var idcheck = JSON.parse(JSON.stringify(await executeQuery({
                    query: 'CALL selectCountCategoryID(?)',
                    values: [id],
                })));
                totalCount += 1
            }
            
            if (totalCount >= 100) {
                res.status(500).json({message: 'Too many uuids checked, please try again'})
                return
            }
            else {
                /* insert data into category table */
                const result = await executeQuery({
                    query: 'CALL insertCategoryData(?, ?, ?, ?)',
                    values: [req.query.id, id, categoryName, categoryColor],
                });

                res.status(201).json({ message: 'success' })
                return
            }
        }
        /** more than 50 categories */
        else {
            res.status(409).json({ message: 'Too many categories created, please remove some before adding more' })
            return
        }
    }
    /** if request body components do not fit requirements */
    catch {
        res.status(500).json({ message: 'Internal server error' })
        return
    }
}

/**
API request body must follow the structure below

{
    categoryName: string,   required    (between 1 and 255 characters long)
    categoryColor: string,  required    (between 1 and 7 characters long & must be a recognised color in utils/colors.ts)
}

Requires authentication?    yes

Response format             201         json        {message: 'success'}

Errors
304         limit of 50 categories has been reached
400         request body not following above structure
401         unauthenticated
405         request not using POST method
500         unexpected server error

*/