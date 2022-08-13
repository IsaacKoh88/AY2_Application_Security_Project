import type { NextApiRequest } from "next";

const postValidator = async (
    req: NextApiRequest,
) => {
    if (req.method !== 'POST') {
        throw 405
    };
    if (!req.body) {
        throw 400
    };
};

export default postValidator;