import React from 'react';
import { Link } from 'react-router-dom';
import { Typography } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

import Card from 'Components/Card';
import Loader from 'Components/Loader';
import { verify } from 'Domains/Accounts/api';
import useApi from 'hooks/useApi';
import useSnack from 'hooks/useSnack';

interface VerificationProps {
    verificationKey: string;
}

function Verification({ verificationKey }: VerificationProps) {
    const [snack] = useSnack();
    const [errorMessage, setErrorMessage] = React.useState('');
    const [verified, setVerified] = React.useState(false);
    const request = React.useCallback(() => verify(verificationKey), [
        verificationKey,
    ]);
    const [sendRequest, isLoading] = useApi(request, {
        onSuccess: () => setVerified(true),
        onFailure: (error, results) => {
            console.log(error);
            if (results) {
                setErrorMessage(results.data.error);
            } else {
                setErrorMessage('Something went wrong. Try again later!');
                snack('Something went wrong. Try again later!', 'error');
            }
        },
    });

    React.useEffect(() => {
        sendRequest();
    }, [sendRequest]);

    if (isLoading) {
        return <Loader centerPage />;
    }

    return (
        <Container maxWidth='sm'>
            <Card>
                <Typography variant='h6' color='primary' align='center'>
                    {verified ? (
                        <>
                            <CheckCircleIcon style={{ fontSize: 90 }} />
                            <div>Your account is now verified!</div>
                            <div>
                                <Link to='/sign-in'>
                                    Follow this link to sign in to your account
                                </Link>
                            </div>
                        </>
                    ) : (
                        <div>{errorMessage}</div>
                    )}
                </Typography>
            </Card>
        </Container>
    );
}

export default Verification;
