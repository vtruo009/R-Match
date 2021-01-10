import React from 'react';
import * as socketio_client from 'socket.io-client';

export interface IMessaging {
    data: string;
}

function Messaging() {
    // Initiate socket.
    const io = socketio_client.connect('http://localhost:5000');
    console.log(io);
    return <div>Hello World!</div>;
}

export default Messaging;
