import React from 'react';

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import { Formik, Form, Field } from 'formik';
import * as yup from 'yup';
import SubmitButton from 'Components/SubmitButton';
import Loader from 'Components/Loader';
import { TextFormField } from 'Components/TextFormField';
import { AuthContext } from 'Contexts/AuthContext';
import { IUser } from 'Domains/Accounts/api';
import { sendMessage, io } from 'Domains/Messages/api';
import useApi from 'hooks/useApi';

export interface IMessageSendForm {
    message: string;
}

const formSchema = yup.object({
    message: yup.string().required('Message cannot be empty.'),
});

const messageInitialValues: IMessageSendForm = {
    message: ''
};

interface props {
    receiver: IUser | undefined;
}

function MessageSendForm({ receiver }: props) {
    const [message, setMessage] = React.useState<IMessageSendForm>(messageInitialValues);

    const { user } = React.useContext(AuthContext);

    const request = React.useCallback(() => sendMessage(message, receiver), [message, receiver]);
    const [sendRequest, isLoading] = useApi(request, {
        onSuccess: () => {
            io.emit('chat', { message: message, receiver: receiver, sender: {id: user?.userId } });
        },
        onFailure: (error, response) => {
            console.log(error);
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
                                <SubmitButton fullWidth={true} type='submit' isLoading={isLoading} disabled={receiver === undefined}>
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