import type { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from '../../../../utils/db'
import authorisedValidator from '../../../../utils/authorised-validator';

type Data = {
    message: string
}

export default async function EditCategory(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    /* accepts only POST requests and non-empty requests */
    if ((req.method == 'POST') && (req.body) && (req.cookies['token'])) {
        /** check user authorisation */
        await authorisedValidator(req, res);

        try {
            /** deconstruct body data */
            const { categoryID, categoryName, categoryColor } = req.body;

            if ((categoryID.length === 36) && (categoryName.length <= 255) && (categoryColor === 'red' || categoryColor === 'orange' || categoryColor === 'amber' || categoryColor === 'yellow' || categoryColor === 'lime' || categoryColor === 'green' || categoryColor === 'emerald' || categoryColor === 'teal' || categoryColor === 'cyan' || categoryColor === 'sky' || categoryColor === 'blue' || categoryColor === 'indigo' || categoryColor === 'violet' || categoryColor === 'purple' || categoryColor === 'fuchsia' || categoryColor === 'pink' || categoryColor === 'rose')) {
                try {
                    const idcheck = await executeQuery({
                        query: 'SELECT COUNT(*) FROM category WHERE AccountID=? AND ID=?',
                        values: [req.query.id, categoryID],
                    });

                    if (idcheck[0]['COUNT(*)'] === 1) {
                        /* insert data into category table */
                        const result = await executeQuery({
                            query: 'UPDATE category SET Name=?, Color=? WHERE AccountID=? AND ID=?',
                            values: [categoryName, categoryColor, req.query.id, categoryID],
                        });

                        res.status(201).json({ message: 'success' })
                        return
                    }
                    /** event ID does not exist */
                    else {
                        res.statusCode = 404;
                        res.end('Event not found');
                    }
                }
                /** event ID does not exist */
                catch {
                    res.statusCode = 404;
                    res.end('Event not found');
                }
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