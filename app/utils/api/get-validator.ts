import type { NextApiRequest } from "next";

const getValidator = async (
    req: NextApiRequest,
) => {
    if (req.method !== 'GET') {
        throw 405
    };
};

export default getValidator;