import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { useHistory } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as yup from 'yup';

import useApi from 'hooks/useApi';
import useSnack from 'hooks/useSnack';
import { TextFormField } from 'Components/TextFormField';
import SubmitButton from 'Components/SubmitButton';
import { signIn } from 'Domains/Accounts/api/api';
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
            console.log(error);
            if (results && results.status === 401) {
                snack('Invalid username or password', 'error');
            } else {
                snack('Something went wrong. Try again later!', 'error');
            }
        },
    });

    return (
        <Paper style={{ padding: 50 }}>
            <Formik
                validationSchema={formSchema}
                initialValues={formInitialValues}
                onSubmit={(formValues, actions) => {
                    setSignInInfo(formValues);
                    sendRequest();
                    actions.resetForm({
                        values: { ...formInitialValues },
                    });
                }}
            >
                {() => (
                    <Form>
                        <Grid
                            container
                            spacing={3}
                            direction='column'
                            justify='center'
                            alignItems='center'
                        >
                            <Grid item container justify='center'>
                                <Typography variant='h4'>Sign In</Typography>
                            </Grid>
                            <Grid item container spacing={5} justify='center'>
                                <Grid item md={7} xs={12}>
                                    <Field
                                        name='email'
                                        label='Email'
                                        component={TextFormField}
                                    />
                                </Grid>
                                <Grid item md={7} xs={12}>
                                    <Field
                                        name='password'
                                        label='Password'
                                        type='password'
                                        component={TextFormField}
                                    />
                                </Grid>
                            </Grid>
                            <Grid item>
                                <SubmitButton isLoading={isLoading} />
                            </Grid>
                            <Grid item>
                                <Typography variant='h6'>
                                    <a href='sign-up'>
                                        Don't have an account yet? Create one!
                                    </a>
                                </Typography>
                            </Grid>
                        </Grid>
                    </Form>
                )}
            </Formik>
        </Paper>
    );
}

export default SignInForm;
