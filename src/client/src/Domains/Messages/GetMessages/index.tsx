import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import useApi from 'hooks/useApi';
import { AuthContext } from 'Contexts/AuthContext';
import Loader from 'Components/Loader';
import Button from 'Components/Button';
import { IUser } from 'Domains/Accounts/api';
import MessageDialog from 'Domains/Messages/MessageDialog';
import { IMessage, getMessages, io } from 'Domains/Messages/api';

interface MessagesProps {
    receiver?: IUser;
}
function Messages({ receiver }: MessagesProps) {
    const [page, setPage] = React.useState<number>(1);
    const [messageCount, setMessageCount] = React.useState<number>(0);

    const [messages, setMessages] = React.useState<IMessage[]>([]);
    const { user } = React.useContext(AuthContext);
    const request = React.useCallback(() => getMessages(page, receiver), [page, receiver]);
    const [sendRequest, isLoading] = useApi(request, {
        onSuccess: (response) => {
            setMessages(response.data.messages);
            setMessageCount(response.data.messagesCount);
        },
    });

    const chatArea = document.querySelector('#chatArea');

    React.useEffect(() => {
        if (receiver) {
            sendRequest();
            setPage(1);
        }
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

    const loadMoreMessage = () => {
        setPage(page + 1);
        sendRequest();
    };

    // Scroll to the bottom of the chat area when the user switches between receivers.
    // Scroll to the bottom of new messages appeared when the user clicks on the "Load more..." button.
    React.useEffect(() => {
        if (chatArea) {
            const numNewMessages = messageCount - (page - 1) * 20;
            chatArea.scrollTop = (chatArea.scrollHeight - chatArea.clientHeight) / messageCount * numNewMessages;
        }
    }, [messages, messageCount, chatArea, page]);

    return receiver ? (
        <div style={{ margin: 30 }}>
            <Grid container justify='center'>
                <Grid item xs={12}>
                    <Typography variant='h6' color='primary'>
                        Message with {receiver.firstName} {receiver.lastName}
                    </Typography>
                </Grid>
                <Grid id='chatArea' style={{ overflow: 'auto', height: '300px', width: '100%' }}>
                    {isLoading ? (
                            <Grid item xs={12}>
                                <Loader />
                            </Grid>
                    ) : (
                            <Grid item>
                                {messageCount > page * 20 &&
                                    <Button
                                        onClick={loadMoreMessage}
                                        fullWidth={true}
                                    >
                                        Load more...
                                    </Button>
                                }
                                {/* Render all ongoing conversations. */}
                                {messages.map((message, index) => (
                                    <Grid item key={index} xs={12}>
                                        <MessageDialog message={message} />
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                </Grid>
            </Grid>
        </div>
    ) : (
        <></>
    );
}

export default Messages;
