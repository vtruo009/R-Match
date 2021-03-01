import React from 'react';
import * as yup from 'yup';
import { Field, Form, Formik } from 'formik';
import Grid from '@material-ui/core/Grid';
import SendIcon from '@material-ui/icons/Send';
import IconButton from '@material-ui/core/IconButton';

import useApi from 'hooks/useApi';
import { TextFormField } from 'Components/TextFormField';
import { AuthContext } from 'Contexts/AuthContext';
import { IUser } from 'Domains/Accounts/api';
import { io, sendMessage } from 'Domains/Messages/api';

export interface IMessageSendForm {
    content: string;
}

const formSchema = yup.object({
    content: yup.string().required('Message cannot be empty.'),
});

const messageInitialValues: IMessageSendForm = {
    content: '',
};

interface MessageSendFormProps {
    receiver?: IUser;
}

function MessageSendForm({ receiver }: MessageSendFormProps) {
    const [message, setMessage] = React.useState<IMessageSendForm>(
        messageInitialValues
    );
    const { user } = React.useContext(AuthContext);
    const request = React.useCallback(() => sendMessage(message, receiver), [
        message,
        receiver,
    ]);
    const [sendRequest] = useApi(request, {
        onSuccess: () => {
            io.emit('new_message', {
                content: message.content,
                receiver: receiver,
                sender: {
                    id: user?.userId,
                    firstName: user?.firstName,
                    lastName: user?.lastName,
                },
            });
        },
    });

    return receiver ? (
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
                    <Grid container spacing={5} alignItems='center'>
                        <Grid item md={10} xs={12}>
                            <Field
                                name='content'
                                label='Message'
                                component={TextFormField}
                                multiline
                            />
                        </Grid>
                        <Grid
                            item
                            md={2}
                            xs={12}
                            style={{ position: 'static' }}
                        >
                            <IconButton
                                color='primary'
                                type='submit'
                                disabled={!receiver}
                            >
                                <SendIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                </Form>
            )}
        </Formik>
    ) : (
        <> </>
    );
}

export default MessageSendForm;
