import React from 'react';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import { IUser } from 'Domains/Accounts/api/api';

import MessageSendForm from 'Domains/Messages/MessageSendForm';
import Messages from 'Domains/Messages/GetMessages';
import ConversationList from 'Domains/Messages/ConversationList';

function MessageRoot() {
    const [receiver, setReceiver] = React.useState<IUser>();

    return (
        <div style={{ padding: 20, margin: 30 }}>
            <div>
                <Grid container spacing={3}>
                    <Grid item md={6} xs={12}>
                        <ConversationList
                            setReceiver={setReceiver}
                        />
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <Paper style={{ padding: 10 }}>
                            <Messages
                                receiver={receiver}
                            />
                            <MessageSendForm
                                receiver={receiver}
                            />
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        </div>
    );
}

export default MessageRoot;