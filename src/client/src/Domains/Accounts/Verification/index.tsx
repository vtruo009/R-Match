import { Typography } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Loader from 'Components/Loader';
import { verify } from 'Domains/Accounts/api';
import useApi from 'hooks/useApi';
import React from 'react';
import { Link } from 'react-router-dom';

interface VerificationProps {
    verificationKey: string;
}

function Verification({ verificationKey }: VerificationProps) {
    const [errorMessage, setErrorMessage] = React.useState<string>('Something went wrong. Try again later!');
    const [verified, setVerified] = React.useState<boolean>(false);

    const request = React.useCallback(() => verify(verificationKey), [verificationKey]);
    const [sendRequest, isLoading] = useApi(request, {
        onSuccess: (response) => {
            setVerified(true);
        },
        onFailure: (error, results) => {
            console.log(error);
            if (results) {
                setErrorMessage(results.data.error);
            }
        },
    });

    React.useEffect(() => {
        sendRequest();
    }, [verificationKey, sendRequest]);

    return (
        <Container maxWidth='sm'>
            <Paper style={{ padding: 80 }}>
            { isLoading ? (
                <Loader />
            ) : (
                <Typography variant='h6' color='primary' align='center'>
                            {verified ? (
                                    <div>
                                    Your account is now verified!
                                        <Typography variant='h6' color='primary'>
                                            <Link to='/sign-in'>
                                                Now you can sign in to your account here.
                                            </Link>
                                        </Typography>
                                    </div>
                                ) : (
                                    <div>
                                        {errorMessage}
                                    </div>
                            )}
                </Typography>
            )}
            </Paper>
        </Container>
    );
}

export default Verification;
