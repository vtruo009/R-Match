import React from 'react';
import { Field, Form, Formik } from 'formik';
import * as yup from 'yup';
import Grid from '@material-ui/core/Grid';

import useApi from 'hooks/useApi';
import useSnack from 'hooks/useSnack';
import SubmitButton from 'Components/SubmitButton';
import { TextFormField } from 'Components/TextFormField';
import { IUser } from 'Domains/Accounts/api';
import { createMessage } from 'Domains/Messages/api';

export interface INewMessageForm {
    email: string;
}

export const formInitialValues: INewMessageForm = {
    email: '',
};

const formSchema = yup.object({
    email: yup.string().required().email('Please enter valid email.'),
});

interface NewMessageFormProps {
    setReceiver: (user: IUser) => void;
    closeForm: () => void;
}

function NewMessageForm({ setReceiver, closeForm }: NewMessageFormProps) {
    const [email, setEmail] = React.useState<INewMessageForm>(
        formInitialValues
    );
    const [snack] = useSnack();

    const request = React.useCallback(() => createMessage(email), [email]);
    const [sendRequest, isLoading] = useApi(request, {
        onSuccess: (response) => {
            const { user } = response.data;
            setReceiver(user);
            snack(
                `You can start a conversation with ${user.firstName}`,
                'success'
            );
            closeForm();
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
        <Formik
            validationSchema={formSchema}
            initialValues={formInitialValues}
            onSubmit={(formValues) => {
                setEmail(formValues);
                sendRequest();
            }}
        >
            {() => (
                <Form>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Field
                                name='email'
                                label='Email'
                                component={TextFormField}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <SubmitButton
                                type='submit'
                                isLoading={isLoading}
                                fullWidth
                            />
                        </Grid>
                    </Grid>
                </Form>
            )}
        </Formik>
    );
}

export default NewMessageForm;
