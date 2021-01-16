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
import { IUser } from 'Domains/Accounts/api/api';

interface props {
    receiver: IUser | undefined;
}

var receiverSelected: IUser | undefined;

function MessageResults({ receiver }: props) {
    alert("receiver: " + receiver?.firstName);
    const [messages, setMessages] = React.useState<IMessage[]>([]);
    const request = React.useCallback(() => getMessages(receiver), []);
    const [sendRequest, isLoading] = useApi(request, {
        onSuccess: (response) => {
            alert("Get messages.");
            if (response.data.messages.length > 0) {
                setMessages(response.data.messages);
            }
        },
        onFailure: () => {
            alert("FAILLL");
        },
    });

    // Reload message when new receiver is selected.
    if (receiver && receiverSelected?.id != receiver.id) {
        receiverSelected = receiver;
        alert("START!");
        sendRequest();
        alert("END!");
    }

    /*
    React.useEffect(() => {
        alert(receiver?.firstName);
        if (receiver) sendRequest();
    }, [sendRequest]);
    */

    // Listen for events.
    io.on('chat', (data: any) => {
        sendRequest();
    });

    return (
        <div style={{ margin: 30 }}>
            {(receiver == undefined) ? (
                <div></div>
            ): (
            <div>
            {isLoading ? (
                <Loader />
            ) : (
                    <div>
                        Message with {receiver.firstName} {receiver.lastName}
                        <ul>
                            {messages.map((message, key) => (
                                <div style={{ margin: 10 }} key={key}>
                                    {message.sender.firstName}: {message.message} ({message.date})
                                </div>
                            ))}
                        </ul>
                        <script>

                        </script>
                    </div>
                )}
        </div>
            )
        }   
        </div >
    );
}

export default MessageResults;
