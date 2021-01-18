import React from 'react';
import Grid from '@material-ui/core/Grid';
import { IMessage } from 'Domains/Messages/api/api';
import { IUser } from 'Domains/Accounts/api/api';

import SendMessageForm from 'Domains/Messages/SendMessageForm';
import MessageResults from 'Domains/Messages/GetMessages';
import GetCommunicatedUser from 'Domains/Messages/GetCommunicatedUser';

function MessageRoot() {
    const [userSelected, setSelectedUser] = React.useState<IUser>();

    return (
        <div style={{ padding: 20 }}>
            <GetCommunicatedUser
                children={
                    <div>
                        <MessageResults receiver={userSelected} />
                        <SendMessageForm receiver={userSelected} />
                    </div>
                }
                setReceiver={setSelectedUser}
            />
        </div>
    );
}

export default MessageRoot;
/*
 *
                        <MessageResults receiver={userSelected} />
 */
