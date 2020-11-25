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
import { SelectFormField } from 'Components/SelectFormField';
import Button from 'Components/Button';
import {
    signUp,
    roles,
} from 'Domains/Accounts/api/api';

export interface ISignUpForm {
    email: string;
    password: string;
    confirmedPassword: string;
    firstName: string;
    lastName: string;
    role: ''|'student' | 'facultyMember';
}

const formInitialValues: ISignUpForm = {
    email: '',
    password: '',
    confirmedPassword: '',
    firstName: '',
    lastName: '',
    role: '',
};

const formSchema = yup.object({
    email: yup.string().required().email('Please enter valid emai.'),
    password: yup.string().required('Password is required.')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
            "Password must contain minimum 8 characters, at least one lowercase " +
            "alphabet, one uppercase alphabet, and one number."),
    confirmedPassword: yup.mixed().required('Please confirm password.')
        .test('match', 'Passwords do not match.', function () {
            return this.parent.confirmedPassword === this.parent.password
    }),
    firstName: yup.string().required('Please enter your first name.'),
    lastName: yup.string().required('Please enter your last name.'),
    role: yup.string().required('Please select one.'),
});

function SignUpForm() {
    const [signUpInfo, setSignUpInfo] = React.useState<ISignUpForm>(formInitialValues);
    const request = React.useCallback(() => signUp(signUpInfo), [signUpInfo]);
    const [snack] = useSnack();
    const [sendRequest, isLoading] = useApi(request, {
        onSuccess: () => {
            snack('Signed up successfully', 'success');
        },
    });
    return (
        <Paper style={{ padding: 50 }}>
            <Formik
                validationSchema={formSchema}
                initialValues={formInitialValues}
                onSubmit={(formValues, actions) => {
                    setSignUpInfo(formValues);
                    sendRequest();
                    actions.resetForm({
                        values: { ...formInitialValues },
                    });
                }}
            >
                {() => (
                    <Form>
                            <Grid container spacing={3} alignContent='center'>
                            <Grid item container justify='flex-start'>
                                <Typography variant='h4'>Create New Account</Typography>
                            </Grid>
                            <Grid item container spacing={5}>
                                <Grid item md={6} xs={12}>
                                    <Field
                                        name='firstName'
                                        label='First Name'
                                        component={TextFormField}
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <Field
                                        name='lastName'
                                        label='Last Name'
                                        component={TextFormField}
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <Field
                                        name='email'
                                        label='Email'
                                        component={TextFormField}
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <Field
                                        name='password'
                                        label='Password'
                                        multiline
                                        component={TextFormField}
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <Field
                                        name='role'
                                        label='You are...'
                                        options={roles}
                                        component={SelectFormField}
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <Field
                                        name='confirmedPassword'
                                        label='Confirm Password'
                                        multiline
                                        component={TextFormField}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container item xs={12}>
                                <Button type='submit' isLoading={isLoading}>
                                    Submit
                                    {isLoading && <Loader size={20} />}
                                </Button>
                            </Grid>
                        </Grid>
                    </Form>
                )}
            </Formik>
        </Paper>
    );
}

export default SignUpForm;
