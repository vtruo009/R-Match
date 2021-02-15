import React from 'react';
import { useParams } from 'react-router-dom';

import MessageRoot from 'Domains/Messages/MessageRoot';

interface MessageParams {
    email?: string;
}

function Message() {
    const { email } = useParams<MessageParams>();
    return (
        <div style={{ margin: 50 }}>
            <MessageRoot email={email}/>
        </div>
    );
}

export default Message;