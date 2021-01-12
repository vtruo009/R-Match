import React from 'react';
import Grid from '@material-ui/core/Grid';
import {
    IMessage,
    getMessages,
    io
} from 'Domains/Messages/api/api';
import useApi from 'hooks/useApi';
import Button from '@material-ui/core/Button';
import Loader from 'Components/Loader';


function MessageResults() {
    var [messages, setMessages] = React.useState<IMessage[]>([]);
    const request = React.useCallback(() => getMessages(), []);
    const [sendRequest, isLoading] = useApi(request, {
        onSuccess: (response) => {
            if (response.data.messages.length > 0) {
                setMessages(response.data.messages);
            }
        }
    });

    // Listen for events.
    io.on('chat', (data: any) => {
        sendRequest();
    });

    return (
        <div style={{ margin: 30 }}>
            <Button onClick={sendRequest} color='primary' variant='outlined'>
                Get Messages
            </Button>
            <div>
                {isLoading ? (
                    <Loader />
                ) : (
                        <div>
                            <ul>
                            {messages.map((message, key) => (
                                <div style={{ margin: 10 }} key={key}>
                                    NAME: {message.message}
                                </div>
                            ))}
                            </ul>
                            <script>

                            </script>
                        </div>
                    )}
            </div>
        </div>
    );
}

export default MessageResults;
