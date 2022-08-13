import type { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from '../../../../utils/db'
import authorisedValidator from '../../../../utils/authorised-validator';
import apiErrorHandler from '../../../../utils/api-error-handler';

type Data = {
    message: string
}

export default async function DeleteCategory(
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

        try {
            /** deconstruct body data */
            const { categoryID } = req.body;

            if (categoryID.length === 36) {
                /* delete data into category table */
                const result = await executeQuery({
                    query: 'CALL deleteCategoryData(?, ?)',
                    values: [req.query.id, categoryID],
                });

                res.status(200).json({ message: 'success' })
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

/**
API request body must follow the structure below

{
    categoryID: string      required    (36 character UUID format & must be a valid categoryID)
}

Requires authentication?    yes

Response format             200         json        {message: 'success'}

Errors
400         request body not following above structure
401         unauthenticated
405         request not using POST method

*/