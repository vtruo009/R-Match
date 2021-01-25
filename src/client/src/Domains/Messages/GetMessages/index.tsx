import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import useApi from 'hooks/useApi';
import { AuthContext } from 'Contexts/AuthContext';
import Loader from 'Components/Loader';
import { IUser } from 'Domains/Accounts/api';
import MessageDialog from 'Domains/Messages/MessageDialog';
import { IMessage, getMessages, io } from 'Domains/Messages/api';

interface MessagesProps {
    receiver?: IUser;
}
function Messages({ receiver }: MessagesProps) {
    const [messages, setMessages] = React.useState<IMessage[]>([]);
    const { user } = React.useContext(AuthContext);
    const request = React.useCallback(() => getMessages(receiver), [receiver]);
    const [sendRequest, isLoading] = useApi(request, {
        onSuccess: (response) => {
            setMessages(response.data.messages);
        },
    });

    React.useEffect(() => {
        if (receiver) sendRequest();
    }, [receiver, sendRequest]);

    React.useEffect(() => {
        // Update io listener by every receiver update.
        io.removeListener('message_area');
        io.on('message_area', (message: IMessage) => {
            // Append new message to the current message list if the new
            // message is sent between the logged-in user and the current receiver.
            if (
                receiver &&
                ((message.sender.id === receiver.id &&
                    message.receiver.id === user?.userId) ||
                    (message.receiver.id === receiver.id &&
                        message.sender.id === user?.userId))
            ) {
                setMessages((prevMessages) => [...prevMessages, message]);
            }
        });
    }, [receiver, user]);

    return receiver ? (
        <div style={{ margin: 30 }}>
            <Grid container justify='center'>
                <Grid item xs={12}>
                    <Typography variant='h6' color='primary'>
                        Message with {receiver.firstName} {receiver.lastName}
                    </Typography>
                </Grid>
                <Grid style={{ overflow: 'auto', height: '300px', width: '100%' }}>
                    {isLoading ? (
                        <Grid item xs={12}>
                            <Loader />
                        </Grid>
                    ) : (
                        messages.map((message, index) => (
                            <Grid item key={index} xs={12}>
                                <MessageDialog message={message} />
                            </Grid>
                        ))
                            )}
                </Grid>
            </Grid>
        </div>
    ) : (
        <></>
    );
}

export default Messages;
