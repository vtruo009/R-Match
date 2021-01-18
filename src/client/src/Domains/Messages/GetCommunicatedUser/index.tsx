import React from 'react';
import Grid from '@material-ui/core/Grid';
import {
    getConversationList,
    io
} from 'Domains/Messages/api/api';
import Paper from '@material-ui/core/Paper';
import useApi from 'hooks/useApi';
import Button from '@material-ui/core/Button';
import { IUser } from 'Domains/Accounts/api/api';
import { IConversation } from 'Domains/Messages/api/api';
import Loader from 'Components/Loader';
import NewMessageForm from 'Domains/Messages/NewMessageForm';
import ConversationPreview from 'Domains/Messages/ConversationPreview';
import Dialog from '@material-ui/core/Dialog';

interface props {
    setReceiver: (user: IUser) => void;
    children: JSX.Element;
}

function GetCommunicateUser({ setReceiver, children }: props) {
    const [open, setOpen] = React.useState(false);

    const [selectedReceiver, setSelectedReceiver] = React.useState<IUser>();

    var [conversations, setConversations] = React.useState<IConversation[]>([]);
    const request = React.useCallback(() => getConversationList(), []);
    const [sendRequest, isLoading] = useApi(request, {
        onSuccess: (response) => {
            if (response.data.conversationList.length > 0) {
                setSelectedReceiver(response.data.conversationList[0].user);
                setReceiver(response.data.conversationList[0].user);
                setConversations(response.data.conversationList);
            }
        }
    });

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    React.useEffect(() => {
        sendRequest();
    }, [sendRequest]);

    React.useEffect(() => {
        if (selectedReceiver) setReceiver(selectedReceiver);
    }, [selectedReceiver]);

    // Listen for events.
    io.on('chat', () => {
            sendRequest();
    });

    return (
        <div style={{ margin: 30 }}>
            <div>
                {isLoading ? (
                    <Loader />
                ) : (
                        <div>
                            <Grid container spacing={3}>

                            {/* Render all users */}
                                <Grid item md={6} xs={12} spacing={3} direction='column'>

                                    <Button
                                        onClick={handleClickOpen}
                                        color='primary'
                                        variant='contained'
                                        fullWidth={true}>
                                    New Message
                                    </Button>
                                {conversations.map((conversation, key) => (
                                    <Grid item key={key}>
                                        <ConversationPreview
                                            conversation={conversation}
                                            onClick={setSelectedReceiver}
                                            isSelected={selectedReceiver !== undefined &&
                                                conversation.user.id === selectedReceiver.id}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                                <Grid item md={6} xs={12}>
                                    <Paper style={{ padding: 10 }}>
                                        {children}
                                    </Paper>
                                </Grid>
                            </Grid>
                        </div>
                    )
                }
            </div>
            <Dialog open={open} onClose={handleClose} maxWidth='md' fullWidth>
                <NewMessageForm
                    setUser={setSelectedReceiver}
                    closeForm={handleClose}
                />
            </Dialog>
        </div>
    );
}

export default GetCommunicateUser;
