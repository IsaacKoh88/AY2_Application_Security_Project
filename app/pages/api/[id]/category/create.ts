import type { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from '../../../../utils/db'
import authorisedValidator from '../../../../utils/authorised-validator';
import { v4 as uuidv4 } from 'uuid';

type Data = {
    message: string
}

export default async function CreateCategory(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    /* accepts only POST requests and non-empty requests */
    if ((req.method == 'POST') && (req.body) && (req.cookies['token'])) {
        /** check user authorisation */
        await authorisedValidator(req, res);

        try {
            /** deconstruct body data */
            const { categoryName, categoryColor } = req.body;

            if ((categoryName.length <= 255) && (categoryColor === 'red' || categoryColor === 'orange' || categoryColor === 'amber' || categoryColor === 'yellow' || categoryColor === 'lime' || categoryColor === 'green' || categoryColor === 'emerald' || categoryColor === 'teal' || categoryColor === 'cyan' || categoryColor === 'sky' || categoryColor === 'blue' || categoryColor === 'indigo' || categoryColor === 'violet' || categoryColor === 'purple' || categoryColor === 'fuchsia' || categoryColor === 'pink' || categoryColor === 'rose')) {
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
                        res.statusCode = 304;
                        res.end('Too many categories created, please remove some before adding more');
                    }
                }
                /** unexpected error */
                catch {
                    res.statusCode = 500;
                    res.end('Unexpected Error');
                }
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