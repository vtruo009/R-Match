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
    // Establishing io connection on first render of Messaging component
    React.useEffect(() => {
        // Initiate socket.
        //const io = socketio_client.connect(serverPath);
    }, []);

    const [message, setMessage] = React.useState<IMessageForm>(messageInitialValues);

    const request = React.useCallback(() => sendMessage(message, receiver), [message]);
    const [sendRequest, isLoading] = useApi(request, {
        onSuccess: () => {
            io.emit('chat', message);
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
                        <Grid container spacing={3} alignContent='center'>
                            <Grid item container spacing={5}>
                                <Grid item md={6} xs={8}>
                                    <Field
                                        name='message'
                                        label='Message'
                                        component={TextFormField}
                                    />
                                </Grid>
                                <SubmitButton type='submit' isLoading={isLoading}>
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
