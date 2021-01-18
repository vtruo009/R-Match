import React from 'react';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import {
    IMessage,
    getMessages,
    io
} from 'Domains/Messages/api/api';
import Typography from '@material-ui/core/Typography';
import useApi from 'hooks/useApi';
import Button from '@material-ui/core/Button';
import Loader from 'Components/Loader';
import { IUser } from 'Domains/Accounts/api/api';
import MessageDialog from 'Domains/Messages/MessageDialog';
import { AuthContext } from 'Contexts/AuthContext';

interface props {
    receiver: IUser | undefined;
}

function MessageResults({ receiver }: props) {
    const [messages, setMessages] = React.useState<IMessage[]>([]);
    const request = React.useCallback(() => getMessages(receiver), [receiver]);
    const { user } = React.useContext(AuthContext);
    const [sendRequest, isLoading] = useApi(request, {
        onSuccess: (response) => {
            setMessages(response.data.messages);
        },
        onFailure: (error, response) => {
            console.log(error);
        },
    });

    React.useEffect(() => {
        if (receiver) sendRequest();
    }, [receiver, sendRequest]);

    // Listen for events.
    io.on('chat', (message: IMessage) => {
        if (receiver &&
            ((message.sender.id === receiver.id && message.receiver.id === user?.userId)
              || (message.receiver.id === receiver.id && message.sender.id === user?.userId)))
            sendRequest();
    });

    return (
        <div style={{ margin: 30 }}>
            {(receiver == undefined) ? (
                <div></div>
            ) : (
                <div>
                    {isLoading ? (
                        <Loader />
                    ) : (
                            <div>
                                <Typography variant='h6' color='primary'>
                                    Message with {receiver.firstName} {receiver.lastName}
                                    </Typography>
                                    <Grid>
                                        {messages.map((message, key) => (
                                            <Grid item key={key}>
                                                <MessageDialog
                                                    message={message}
                                                />
                                            </Grid>
                                    ))}
                                    </Grid>
                            </div>
                        )}
                </div>
            )
        }   
        </div >
    );
}

export default MessageResults;
