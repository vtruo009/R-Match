import React from 'react';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';

import useApi from 'hooks/useApi';
import { AuthContext } from 'Contexts/AuthContext';
import Loader from 'Components/Loader';
import { IUser } from 'Domains/Accounts/api';
import {
    IConversation,
    IMessage,
    getConversationList,
    io,
} from 'Domains/Messages/api';
import NewMessageForm from 'Domains/Messages/NewMessageForm';
import ConversationPreview from 'Domains/Messages/ConversationPreview';

interface ConversationListProps {
    setReceiver: (user: IUser) => void;
    receiver?: IUser;
}

function ConversationList({ setReceiver, receiver }: ConversationListProps) {
    const [openNewMessageForm, setOpenNewMessageForm] = React.useState(false);
    const [conversationList, setConversationList] = React.useState<
        IConversation[]
    >([]);

    const { user } = React.useContext(AuthContext);

    const request = React.useCallback(() => getConversationList(), []);
    const [sendRequest, isLoading] = useApi(request, {
        onSuccess: (response) => {
            if (response.data.conversationList.length > 0) {
                if (!receiver) {
                    setReceiver(response.data.conversationList[0].user);
                }
                setConversationList(response.data.conversationList);
            }
        },
    });

    const handleClickOpen = () => {
        setOpenNewMessageForm(true);
    };
    const handleClose = () => {
        setOpenNewMessageForm(false);
    };

    React.useEffect(() => {
        sendRequest();
    }, [sendRequest]);

    React.useEffect(() => {
        // Reload conversation list when new message arrives.
        io.on('update_conversation', (message: IMessage) => {
            if (
                message.sender.id === user?.userId ||
                message.receiver.id === user?.userId
            )
                sendRequest();
        });
    }, [user, sendRequest]);

    return (
        <div>
            <Grid container justify='center'>
                {isLoading ? (
                    <Loader />
                ) : (
                        <Grid container item spacing={2} direction='column'>
                            <Grid item>
                                <Button
                                    onClick={handleClickOpen}
                                    color='primary'
                                    variant='contained'
                                    fullWidth={true}
                                >
                                    New Message
                                </Button>
                            </Grid>

                            <Grid style={{ overflow: 'auto', height: '400px', width: '100%' }}>
                                {/* Render all ongoing conversations. */}
                                {conversationList.map((conversation, key) => (
                                    <Grid item key={key}>
                                        <ConversationPreview
                                            conversation={conversation}
                                            onClick={setReceiver}
                                            isSelected={
                                                receiver !== undefined &&
                                                conversation.user.id ===
                                                    receiver.id
                                            }
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>
                )}
            </Grid>
            <Dialog
                open={openNewMessageForm}
                onClose={handleClose}
                maxWidth='md'
                fullWidth
            >
                <NewMessageForm
                    setReceiver={setReceiver}
                    closeForm={handleClose}
                />
            </Dialog>
        </div>
    );
}

export default ConversationList;
