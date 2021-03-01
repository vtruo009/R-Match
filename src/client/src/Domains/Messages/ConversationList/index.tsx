import React from 'react';
import Grid from '@material-ui/core/Grid';
import Fab from '@material-ui/core/Fab';
import MessageIcon from '@material-ui/icons/Message';

import useApi from 'hooks/useApi';
import useDialog from 'hooks/useDialog';
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
    const { openDialog, closeDialog, DialogProps, Dialog } = useDialog();
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

    if (isLoading) return <Loader centerRow />;

    return (
        <div>
            <Fab
                variant='extended'
                onClick={openDialog}
                color='primary'
                style={{ margin: 10 }}
            >
                Start conversation <MessageIcon />
            </Fab>
            <Grid
                container
                spacing={2}
                style={{
                    overflow: 'auto',
                    height: '400px',
                    width: '100%',
                }}
            >
                {conversationList.map((conversation, key) => (
                    <Grid item key={key}>
                        <ConversationPreview
                            conversation={conversation}
                            onClick={setReceiver}
                            isSelected={
                                receiver !== undefined &&
                                conversation.user.id === receiver.id
                            }
                        />
                    </Grid>
                ))}
            </Grid>
            <Dialog
                {...DialogProps}
                title="Enter recipient's email"
                maxWidth='sm'
            >
                <NewMessageForm
                    setReceiver={setReceiver}
                    closeForm={closeDialog}
                />
            </Dialog>
        </div>
    );
}

export default ConversationList;
