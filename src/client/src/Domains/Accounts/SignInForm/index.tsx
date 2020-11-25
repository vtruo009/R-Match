import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { Formik, Form, Field } from 'formik';
import * as yup from 'yup';

import useApi from 'hooks/useApi';
import useSnack from 'hooks/useSnack';
import Loader from 'Components/Loader';
import { TextFormField } from 'Components/TextFormField';
import Button from 'Components/Button';
import {
    signIn,
} from 'Domains/Accounts/api/api';

export interface ISignInForm {
    email: string;
    password: string;
}

const formInitialValues: ISignInForm = {
    email: '',
    password: '',
};

const formSchema = yup.object({
    email: yup.string().required('Email is required').email('Please enter valid email'),
    password: yup.string().required('Password is required'),
});

function SignInForm() {
    const [signInInfo, setSignInInfo] = React.useState<ISignInForm>(formInitialValues);
    const request = React.useCallback(() => signIn(signInInfo), [signInInfo]);
    const [snack] = useSnack();
    const [sendRequest, isLoading] = useApi(request, {
        onSuccess: () => {
            snack('Signed in successfully', 'success');
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
                                        multiline
                                        component={TextFormField}
                                    />
                                </Grid>
                            </Grid>
                            <Grid item>
                                <Button type='submit' isLoading={isLoading}>
                                    Submit
                                    {isLoading && <Loader size={20} />}
                                </Button>
                            </Grid>
                            <Grid item>
                                <Typography variant='h6'><a href="sign-up">You don't have an account yet? Create one!</a></Typography>
                            </Grid>
                            
                        </Grid>
                    </Form>
                )}
            </Formik>
        </Paper>
    );
}

export default SignInForm;
