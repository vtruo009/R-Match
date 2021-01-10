import React from 'react';
import * as socketio_client from 'socket.io-client';
import { serverPath } from 'api';
export interface IMessaging {
    data: string;
}

function Messaging() {
    // Establishing io connection on first render of Messaging component
    React.useEffect(() => {
        // Initiate socket.
        const io = socketio_client.connect(serverPath);
        // Outputting io object to browser's console (remove if not needed)
        console.log(io);
    }, []);

    return <div>Hello World!</div>;
}

export default Messaging;
