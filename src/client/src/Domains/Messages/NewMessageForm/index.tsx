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
import SubmitButton from 'Components/SubmitButton';
import { IUser } from 'Domains/Accounts/api';
import { createMessage } from 'Domains/Messages/api';

export interface INewMessageForm {
    email: string;
}

const formInitialValues: INewMessageForm = {
    email: '',
};

const formSchema = yup.object({
    email: yup.string().required().email('Please enter valid emai.')
});

interface Props {
    setReceiver: (user: IUser) => void;
    closeForm: () => void;
}

function NewMessageForm({ setReceiver, closeForm }: Props) {
    const [email, setEmail] = React.useState<INewMessageForm>(formInitialValues);
    const [snack] = useSnack();

    const request = React.useCallback(() => createMessage(email), [email]);
    const [sendRequest, isLoading] = useApi(request, {
        onSuccess: (response) => {
            setReceiver(response.data.user);
            snack('New message successfully created', 'success');
            closeForm();
        },
        onFailure: (error, results) => {
            console.log(error);
            if (results) {
                snack(`${results.data.error}`, 'error');
            } else {
                snack('Something went wrong. Try again later!', 'error');
            }
        }
    });

    return (
        <Paper style={{ padding: 50 }}>
            <Formik
                validationSchema={formSchema}
                initialValues={formInitialValues}
                onSubmit={(formValues, actions) => {
                    setEmail(formValues);
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
                                <Typography variant='h4'>Enter Email</Typography>
                            </Grid>
                            <Grid item container spacing={5}>
                                <Grid item md={6} xs={12}>
                                    <Field
                                        name='email'
                                        label='Email'
                                        component={TextFormField}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container item xs={12}>
                                <SubmitButton type='submit' isLoading={isLoading}>
                                    Submit
                                    {isLoading && <Loader size={20} />}
                                </SubmitButton>
                            </Grid>
                        </Grid>
                    </Form>
                )}
            </Formik>
        </Paper>
    );
}

export default NewMessageForm;
