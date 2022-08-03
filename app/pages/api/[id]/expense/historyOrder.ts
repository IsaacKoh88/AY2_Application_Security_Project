import type { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from '../../../../utils/db'
import authorisedValidator from '../../../../utils/authorised-validator';

type Data = {
    ID: string,
    Name: string,
    Amount: number,
    Date: string
}[]

export default async function GetExpense(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    /* accepts only GET requests and non-empty requests */
    if ((req.method == 'POST') && (req.cookies['token'])) {
        /** check user authorisation */
        await authorisedValidator(req, res);

        const { OrderBy, ID } = req.body;

        /** get expenses based on OrderBy */
        if (OrderBy == 'Date Ascending'){
            const result = JSON.parse(JSON.stringify(await executeQuery({
                query: 'select ID, Name, Amount, DATE_FORMAT(Date, "%Y-%m-%d") Date from expense where AccountId = ? order by Date, Name, Amount',
                values: [ID],
            })));
            res.status(200).json(result)
        }
        else if (OrderBy == 'Date Descending'){
            const result = JSON.parse(JSON.stringify(await executeQuery({
                query: 'select ID, Name, Amount, DATE_FORMAT(Date, "%Y-%m-%d") Date from expense where AccountId = ? order by Date desc, Name, Amount',
                values: [ID],
            })));
            res.status(200).json(result)
        }
        else if (OrderBy == 'Name Ascending'){
            const result = JSON.parse(JSON.stringify(await executeQuery({
                query: 'select ID, Name, Amount, DATE_FORMAT(Date, "%Y-%m-%d") Date from expense where AccountId = ? order by Name, Date, Amount',
                values: [ID],
            })));
            res.status(200).json(result)
        }
        else if (OrderBy == 'Name Descending'){
            const result = JSON.parse(JSON.stringify(await executeQuery({
                query: 'select ID, Name, Amount, DATE_FORMAT(Date, "%Y-%m-%d") Date from expense where AccountId = ? order by Name desc, Date, Amount',
                values: [ID],
            })));
            res.status(200).json(result)
        }
        else if (OrderBy == 'Amount Ascending'){
            const result = JSON.parse(JSON.stringify(await executeQuery({
                query: 'select ID, Name, Amount, DATE_FORMAT(Date, "%Y-%m-%d") Date from expense where AccountId = ? order by Amount, Date, Name',
                values: [ID],
            })));
            res.status(200).json(result)
        }
        else if (OrderBy == 'Amount Descending'){
            const result = JSON.parse(JSON.stringify(await executeQuery({
                query: 'select ID, Name, Amount, DATE_FORMAT(Date, "%Y-%m-%d") Date from expense where AccountId = ? order by Amount desc, Date, Name',
                values: [ID],
            })));
            res.status(200).json(result)
        }
        else{
            res.status(500).json([])
        }
    };
};