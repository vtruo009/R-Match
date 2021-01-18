import React from 'react';
import Paper from '@material-ui/core/Paper';
import { Formik, Form, Field } from 'formik';
import Grid from '@material-ui/core/Grid';
import * as yup from 'yup';
import Typography from '@material-ui/core/Typography';
import { TextFormField } from 'Components/TextFormField';
import SubmitButton from 'Components/SubmitButton';
import Loader from 'Components/Loader';
import { IUser } from 'Domains/Accounts/api/api';
import {
    sendMessage,
    getMessages,
    IMessage,
    io
} from 'Domains/Messages/api/api';
import useApi from 'hooks/useApi';

export interface IMessageForm {
    message: string;
}

const formSchema = yup.object({
    message: yup.string().required('Message cannot be empty.'),
});

const messageInitialValues: IMessageForm = {
    message: ''
};

interface props {
    receiver: IUser | undefined;
}

function MessageSendForm({ receiver }: props) {
    const [message, setMessage] = React.useState<IMessageForm>(messageInitialValues);

    const request = React.useCallback(() => sendMessage(message, receiver), [message, receiver]);
    const [sendRequest, isLoading] = useApi(request, {
        onSuccess: () => {
            io.emit('chat', { message: message, receiver: receiver });
        },
    });

    return (
        <Paper style={{ padding: 30 }}>
            <Formik
                validationSchema={formSchema}
                initialValues={messageInitialValues}
                onSubmit={(formValues, actions) => {
                    setMessage(formValues);
                    sendRequest();
                    actions.resetForm({
                        values: { ...messageInitialValues },
                    });
                }}
            >
                {() => (
                    <Form>
                        <Grid item container spacing={5}
                            direction='row'
                            justify='space-evenly'
                            alignItems='center'>
                            <Grid item xs={8}>
                                <Field
                                    name='message'
                                    label='Message'
                                    component={TextFormField}
                                />
                            </Grid>
                            <Grid item md={3} xs={2}>
                                <SubmitButton fullWidth={true} type='submit' isLoading={isLoading || receiver === undefined}>
                                    Send
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

export default MessageSendForm;
