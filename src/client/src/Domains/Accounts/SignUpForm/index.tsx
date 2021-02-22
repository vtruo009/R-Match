import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import { Formik, Form, Field } from 'formik';
import * as yup from 'yup';

import useApi from 'hooks/useApi';
import useSnack from 'hooks/useSnack';
import { TextFormField } from 'Components/TextFormField';
import { SelectFormField } from 'Components/SelectFormField';
import SubmitButton from 'Components/SubmitButton';
import { signUp, roles } from 'Domains/Accounts/api';

export interface ISignUpForm {
    email: string;
    password: string;
    confirmedPassword: string;
    firstName: string;
    lastName: string;
    role: '' | 'student' | 'facultyMember';
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
    email: yup.string().required().email('Please enter valid email.'),
    password: yup
        .string()
        .required('Password is required.')
        .matches(
            /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/,
            'Password must contain 8 to 15 characters with at least one lowercase letter, one uppercase letter, one digit, and one special character.'
        ),
    confirmedPassword: yup
        .mixed()
        .required('Please confirm password.')
        .test('match', 'Passwords do not match.', function () {
            return this.parent.confirmedPassword === this.parent.password;
        }),
    firstName: yup.string().required('Please enter your first name.'),
    lastName: yup.string().required('Please enter your last name.'),
    role: yup.string().required('Please select one.'),
});

function SignUpForm() {
    const [signUpInfo, setSignUpInfo] = React.useState<ISignUpForm>(
        formInitialValues
    );
    const request = React.useCallback(() => signUp(signUpInfo), [signUpInfo]);
    const [snack] = useSnack();
    const [sendRequest, isLoading] = useApi(request, {
        onSuccess: () => {
            snack('We sent an email verification link to your email. Please check your inbox.', 'success');
        },
        onFailure: (error, results) => {
            console.log(error);
            if (results) {
                snack(`${results.data.error}`, 'error');
            } else {
                snack('Something went wrong. Try again later!', 'error');
            }
        },
    });
    return (
        <Container maxWidth='md'>
            <Paper style={{ padding: 80 }}>
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
                            <Grid container spacing={5} justify='center'>
                                <Grid item xs={12}>
                                    <Typography variant='h4' align='center'>
                                        Create New Account
                                    </Typography>
                                </Grid>
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
                                        name='role'
                                        label='You are...'
                                        options={roles}
                                        component={SelectFormField}
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
                                        type='password'
                                        component={TextFormField}
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <Field
                                        name='confirmedPassword'
                                        label='Confirm Password'
                                        type='password'
                                        component={TextFormField}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <SubmitButton
                                        isLoading={isLoading}
                                        fullWidth
                                        label='sign up'
                                    />
                                </Grid>
                            </Grid>
                        </Form>
                    )}
                </Formik>
            </Paper>
        </Container>
    );
}

export default SignUpForm;
