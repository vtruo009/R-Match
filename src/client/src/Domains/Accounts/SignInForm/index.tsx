import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { Link } from 'react-router-dom';
import Container from '@material-ui/core/Container';
import { useHistory } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as yup from 'yup';

import useApi from 'hooks/useApi';
import useSnack from 'hooks/useSnack';
import { TextFormField } from 'Components/TextFormField';
import SubmitButton from 'Components/SubmitButton';
import { signIn } from 'Domains/Accounts/api';
import { AuthContext } from 'Contexts/AuthContext';
export interface ISignInForm {
    email: string;
    password: string;
}

const formInitialValues: ISignInForm = {
    email: '',
    password: '',
};

const formSchema = yup.object({
    email: yup
        .string()
        .required('Email is required')
        .email('Please enter valid email'),
    password: yup.string().required('Password is required'),
});

function SignInForm() {
    const history = useHistory();
    const { setUser, setIsAuthenticated } = React.useContext(AuthContext);
    const [signInInfo, setSignInInfo] = React.useState<ISignInForm>(
        formInitialValues
    );
    const request = React.useCallback(() => signIn(signInInfo), [signInInfo]);
    const [snack] = useSnack();
    const [sendRequest, isLoading] = useApi(request, {
        onSuccess: (results) => {
            const { isAuthenticated, user } = results.data;
            if (isAuthenticated) {
                setUser(user);
                setIsAuthenticated(isAuthenticated);
                // Redirects user to his/her profile page
                history.push('/profile');
            } else {
                snack('Invalid email or password', 'error');
            }
        },
        onFailure: (error, results) => {
            if (results && results.status === 401) {
                if (results.data.error) {
                    snack(results.data.error, 'error');
                } else {
                    snack('Invalid username or password', 'error');
                }
            } else {
                snack('Something went wrong. Try again later!', 'error');
            }
        },
    });

    return (
        <Container maxWidth='sm'>
            <Paper style={{ padding: 80 }}>
                <Formik
                    validationSchema={formSchema}
                    initialValues={formInitialValues}
                    onSubmit={(formValues) => {
                        setSignInInfo(formValues);
                        sendRequest();
                    }}
                >
                    {() => (
                        <Form>
                            <Grid
                                container
                                spacing={5}
                                justify='center'
                                alignItems='center'
                            >
                                <Grid item xs={12}>
                                    <Typography variant='h4' align='center'>
                                        Sign In
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Field
                                        name='email'
                                        label='Email'
                                        component={TextFormField}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Field
                                        name='password'
                                        label='Password'
                                        type='password'
                                        component={TextFormField}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <SubmitButton
                                        isLoading={isLoading}
                                        fullWidth
                                        label='sign in'
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Link to='/sign-up'>
                                        <Typography variant='h6' align='center'>
                                            Don't have an account yet? Create
                                            one!
                                        </Typography>
                                    </Link>
                                </Grid>
                            </Grid>
                        </Form>
                    )}
                </Formik>
            </Paper>
        </Container>
    );
}

export default SignInForm;
