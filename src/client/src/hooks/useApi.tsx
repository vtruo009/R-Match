import React from 'react';
import { AxiosResponse } from 'axios';
import useSnack from 'hooks/useSnack';

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

        // Minimum time to wait for an API request to complete: 600 ms.
        const minWaitTime = () =>
            new Promise((resolve) => {
                setTimeout(resolve, 600);
            });

        const request = async function () {
            try {
                // await for the API request and minimum wait time
                const [promiseResponse] = await Promise.allSettled([
                    endpoint(),
                    minWaitTime(),
                ]);

                setIsLoading(false);
                if (promiseResponse.status === 'fulfilled') {
                    actualOnSuccess(promiseResponse.value);
                } else {
                    actualOnFailure(new Error('Sending the request failed'));
                }
            } catch (error) {
                setIsLoading(false);
                actualOnFailure(error as Error);
            }
        };

        if (isLoading) {
            request();
        }
    }, [isLoading, endpoint, onSuccess, onFailure, snack]);

    return [sendRequest, isLoading];
}
