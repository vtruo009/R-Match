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

export interface IJobForm {
    email: string;
    password: string;
}

const formInitialValues: IJobForm = {
    email: '',
    password: '',
};

const formSchema = yup.object({
    email: yup.string().required('Email is required'),
    password: yup.string().required('Password is required'),
});

function JobForm() {
    const [job, setJob] = React.useState<IJobForm>(formInitialValues);
    const request = React.useCallback(() => signIn(job), [job]);
    const [snack] = useSnack();
    const [sendRequest, isLoading] = useApi(request, {
        onSuccess: () => {
            snack('Job successfully created', 'success');
        },
    });
    return (
        <Paper style={{ padding: 50 }}>
            <Formik
                validationSchema={formSchema}
                initialValues={formInitialValues}
                onSubmit={(formValues, actions) => {
                    setJob(formValues);
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
                                <Typography variant='h4'>Sign In</Typography>
                            </Grid>
                            <Grid item container spacing={5}>
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

export default JobForm;
