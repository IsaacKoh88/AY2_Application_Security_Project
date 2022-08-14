import type { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from '../../../../utils/connections/db'
import authorisedValidator from '../../../../utils/api/authorised-validator';
import postValidator from '../../../../utils/api/post-validator';
import inputFormat from '../../../../utils/input-format';
import apiErrorHandler from '../../../../utils/api/api-error-handler';

type Data = {
    message: string
}

export default async function EditCategory(
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
            if (!new inputFormat().validateuuid(req.body.categoryID)) {
                throw 400;
            }
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
    const { categoryID, categoryName, categoryColor } = req.body;

    try {
        const idcheck = JSON.parse(JSON.stringify(await executeQuery({
            query: 'CALL selectCountCategoryID(?)',
            values: [categoryID],
        })));

        if (idcheck[0][0]['COUNT(*)'] === 1) {
            try {
                /* insert data into category table */
                const result = await executeQuery({
                    query: 'CALL updateCategory(?, ?, ?, ?)',
                    values: [req.query.id, categoryID, categoryName, categoryColor],
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
            res.status(404).json({ message: 'Category not found' })
            return
        }
    }
    /** event ID does not exist */
    catch {
        res.status(500).json({ message: 'Internal server error' })
        return
    }
}

/**
API request body must follow the structure below

{
    categoryID: string      required    (36 character UUID format & must be a valid categoryID)
    categoryName: string,   required    (between 1 and 255 characters long)
    categoryColor: string,  required    (between 1 and 7 characters long & must be a recognised color in utils/colors.ts)
}

Requires authentication?    yes

Response format             201         json        {message: 'success'}

Errors
400         request body not following above structure
401         unauthenticated
404         category not found
405         request not using POST method

*/