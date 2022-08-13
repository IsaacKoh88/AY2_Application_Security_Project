import { CustomError } from './custom-error';

interface Error {
    status?: number,
    code?: number,
}

const fetcher = async (url:string) => {
    const res = await fetch(url);
    if (res.status === 200) {
        return res.json();
    } 
    const error = new CustomError(401, 'Not Authorised!')
    throw error;
}

export default fetcher