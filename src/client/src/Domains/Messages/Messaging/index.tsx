import React from 'react';
import { Route } from 'react-router-dom';
import * as socketio_client from 'socket.io-client';

export interface IMessaging {
    data: string;
}

function Messaging() {
    // Initiate socket.
    const io = socketio_client.connect('http://localhost:6000');

    return (
        <div className="App">
                Hello World!
        </div>
    );
}

export default Messaging;
