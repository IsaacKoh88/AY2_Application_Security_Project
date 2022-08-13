import { NextApiResponse } from "next";

const apiErrorHandler = (
    error: any,
    res: NextApiResponse
) => {
    if (error === 401) {
        /** Authentication error */
        res.status(401).json({ message: 'Invalid Token' });
        return
    }

    if (error === 403) {
        /** Authorisation error */
        res.status(403).json({ message: 'Not Authorised' });
        return
    }

    /** Default to 500 internal server error */
    res.status(500).json({ message: 'Internal Server Error' });
    return
};

export default apiErrorHandler;