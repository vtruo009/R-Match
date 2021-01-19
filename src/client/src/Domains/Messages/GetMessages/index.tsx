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
    receiver: IUser | undefined;
}

function Messages({ receiver }: MessagesProps) {
    var [messages, setMessages] = React.useState<IMessage[]>([]);

    const { user } = React.useContext(AuthContext);

    const request = React.useCallback(() => getMessages(receiver), [receiver]);
    const [sendRequest, isLoading] = useApi(request, {
        onSuccess: (response) => {
            setMessages(response.data.messages);
        }
    });

    React.useEffect(() => {
        if (receiver) sendRequest();
    }, [receiver, sendRequest]);

    // Reload messaging component if new message is created between the
    // logged-in user and the current receiver.
    io.on('chat', (message: IMessage) => {
        if (receiver &&
            ((message.sender.id === receiver.id && message.receiver.id === user?.userId)
                || (message.receiver.id === receiver.id && message.sender.id === user?.userId))) {
            sendRequest();
            // messages.push(message);
        }
    });

    return (
        <div style={{ margin: 30 }}>
            {(receiver === undefined) ? (
                <div></div>
            ) : (
                    <div>

                        <div>
                            <Typography variant='h6' color='primary'>
                            Message with {receiver.firstName} {receiver.lastName}
                            </Typography>

                            {isLoading ? (
                                <Loader />
                            ) : (
                                    <Grid>
                                        {/* Render all messages. */}
                                        {messages.map((message, index) => (
                                            <Grid item key={index}>
                                                <MessageDialog
                                                    message={message}
                                                />
                                            </Grid>
                                        ))}
                                    </Grid>
                            )}
                        </div>
                    </div>
            )
        }   
        </div >
    );
}

export default Messages;