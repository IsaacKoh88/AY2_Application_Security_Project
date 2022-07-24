import type { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from '../../../../utils/db'
import authorisedValidator from '../../../../utils/authorised-validator';

type Data = {
    Budget: number,
}

export default async function GetBudget(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    /* accepts only GET requests and non-empty requests */
    if ((req.method == 'POST') && (req.cookies['token'])) {
        /** check user authorisation */
        await authorisedValidator(req, res);

        /** deconstruct request body */
        const { Month } = req.body;

        /* get budget */
        const result = JSON.parse(JSON.stringify(await executeQuery({
            query: 'SELECT Budget FROM budget WHERE AccountID=?',
            values: [req.query.id],
        })));

        res.status(200).json({ Budget: result.Budget })

    };
};