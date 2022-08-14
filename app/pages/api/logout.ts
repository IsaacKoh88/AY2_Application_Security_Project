import type { NextApiRequest, NextApiResponse } from 'next'
import authorisedValidator from '../../utils/api/authorised-validator';
import getValidator from '../../utils/api/get-validator';
import inputFormat from '../../utils/input-format';
import apiErrorHandler from '../../utils/api/api-error-handler';
import redisClient from '../../utils/connections/redis';

type Data = {
    message: string
}

const LogoutHandler = async (
    req: NextApiRequest,
    res: NextApiResponse<Data>
) => {
    try {
        /** check user authorisation */
        await authorisedValidator(req);

        /** check if request is GET */
        await getValidator(req);

        /** validate if request params are correct */
        if (!new inputFormat().validateuuid(req.query.id)) {
            throw 400;
        };
    }
    catch (error) {
        apiErrorHandler(error, res);
        return
    }

    try {
        /** adds jwt to redis blacklist */
        if (req.cookies['token']) {
            await redisClient.executeIsolated(async isolatedClient => {
                await isolatedClient.set(
                    ('bl_'+req.cookies['token']), 
                    req.cookies['token']!,
                    {
                        EX: 60*60,
                        NX: true
                    }
                );
            })
            res.status(200).json({ message: 'success' })
            return
        } else {
            res.status(400).json({ message: 'bad request' })
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'internal server error' })
        return
    }
};

export default LogoutHandler;