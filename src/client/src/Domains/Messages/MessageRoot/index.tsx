import React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import useApi from 'hooks/useApi';
import Loader from 'Components/Loader';
import { IUser } from 'Domains/Accounts/api';
import MessageSendForm from 'Domains/Messages/MessageSendForm';
import Messages from 'Domains/Messages/GetMessages';
import ConversationList from 'Domains/Messages/ConversationList';
import { createMessage } from 'Domains/Messages/api';
import { formInitialValues, INewMessageForm } from 'Domains/Messages/NewMessageForm';

interface MessageRootProps {
    email?: string;
}

function MessageRoot({ email }: MessageRootProps) {
    const [receiver, setReceiver] = React.useState<IUser>();

    const [newMessageForm, setNewMessageForm] = React.useState<INewMessageForm>(
        formInitialValues
    );

    const request = React.useCallback(() => createMessage(newMessageForm), [newMessageForm]);
    const [sendRequest, isLoading] = useApi(request, {
        onSuccess: (response) => {
            setReceiver(response.data.user);
        }
    });

    React.useEffect(() => {
        // Check if email is populated with a valid email.
        if (email && email.length > 0 && email !== ':email') {
            setNewMessageForm({ email });
            sendRequest();
        }
    }, [email, sendRequest, setNewMessageForm]);

    return (
        <div style={{ padding: 20, margin: 30 }}>
            {isLoading ? (
                <Loader />
            ) : (
                    <Grid container spacing={3}>
                        <Grid item md={6} xs={12}>
                            <ConversationList setReceiver={setReceiver} receiver={receiver} />
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <Paper style={{ padding: 10 }}>
                                <Messages receiver={receiver} />
                                <MessageSendForm receiver={receiver} />
                            </Paper>
                        </Grid>
                    </Grid>
            )}
        </div>
    );
}

export default MessageRoot;
