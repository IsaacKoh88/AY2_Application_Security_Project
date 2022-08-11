import axios, { AxiosRequestConfig } from 'axios';
//import { ApiResponse } from '../../models/ApiResponse';

export type SuccessfulResponse<T> = { data: T; error?: never; statusCode?: number };
export type UnsuccessfulResponse<E> = { data?: never; error: E; statusCode?: number };

export type ApiResponse<T, E = unknown> = SuccessfulResponse<T> | UnsuccessfulResponse<E>;

export const uploadFileRequest = async (
    formData: FormData,
    progressCallback?: (progressEvent: ProgressEvent) => void
): Promise<ApiResponse<string[]>> => {
    const config: AxiosRequestConfig = {
        headers: { 'content-type': 'multipart/form-data' },
        onUploadProgress: progressCallback,
        validateStatus: (status) => true,
    };
    const response = await axios.post('/api/uploadfile', formData, config);

    return response.data;
};