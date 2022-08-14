import { NextApiResponse } from "next";

const apiErrorHandler = (
    error: any,
    res: NextApiResponse
) => {
    console.log(error)
    if (error === 400) {
        /** Request body incorrect format */
        return res.status(400).json({ message: 'Bad Request' })
    }

    if (error === 401) {
        /** Authentication error */
        return res.status(401).json({ message: 'Unauthenticated' });
    }

    if (error === 403) {
        /** Authorisation error */
        return res.status(403).json({ message: 'Unauthorised' });
    }

    if (error === 405) {
        /** Wrong API method */
        return res.status(405).json({ message: 'Method Not Allowed' })
    }

    /** Default to 500 internal server error */
    return res.status(500).json({ message: 'Internal Server Error' });
};

export default apiErrorHandler;