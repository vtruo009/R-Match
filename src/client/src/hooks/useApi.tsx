import React from 'react';
import { AxiosResponse } from 'axios';
import useSnack from '../hooks/useSnack';

type apiReturn = [SendRequest: () => void, IsLoading: boolean];
interface Handlers<T> {
    onSuccess?: (response: AxiosResponse<T>) => void;
    onFailure?: (error: Error) => void;
}
export default function useApi<T>(
    endpoint: () => Promise<AxiosResponse<T>>,
    handlers: Handlers<T>
): apiReturn {
    const [isLoading, setIsLoading] = React.useState(false);
    const [snack] = useSnack();
    const sendRequest = React.useCallback(() => setIsLoading(true), []);
    const { onSuccess, onFailure } = handlers;

    React.useEffect(() => {
        const defaultError = (error: Error) => {
            console.log(error.message);
            snack('Something went wrong! Please try again', 'error');
        };
        const defaultSuccess = () => {
            snack('Request was successful', 'success');
        };

        const actualOnSuccess = onSuccess || defaultSuccess;
        const actualOnFailure = onFailure || defaultError;

        const request = async function () {
            try {
                const response = await Promise.resolve(endpoint());
                setIsLoading(false);
                if (response) {
                    actualOnSuccess(response);
                } else {
                    actualOnFailure(new Error('Sending the request failed'));
                }
            } catch (error) {
                actualOnFailure(error as Error);
                setIsLoading(false);
            }
        };

        if (isLoading) {
            request();
        }
    }, [isLoading, endpoint, onSuccess, onFailure, snack]);

    return [sendRequest, isLoading];
}
