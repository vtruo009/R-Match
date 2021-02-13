import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { IUser } from 'Domains/Accounts/api';
import { createMessage } from 'Domains/Messages/api';
import ConversationList from 'Domains/Messages/ConversationList';
import Messages from 'Domains/Messages/GetMessages';
import MessageSendForm from 'Domains/Messages/MessageSendForm';
import { formInitialValues, INewMessageForm } from 'Domains/Messages/NewMessageForm';
import useApi from 'hooks/useApi';
import Loader from 'Components/Loader';
import React from 'react';

interface MessagingProps {
    email?: string;
}

function MessageRoot({ email }: MessagingProps) {
    const [receiver, setReceiver] = React.useState<IUser>();

    const [newMessageForm, setnewMessageForm] = React.useState<INewMessageForm>(
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
            setnewMessageForm({ email: email });
            sendRequest();
        }
    }, [email, sendRequest, setnewMessageForm]);

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
