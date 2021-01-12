import API from 'api';
import { IMessageForm } from 'Domains/Messages/SendMessage';
import * as socketio_client from 'socket.io-client';
import { serverPath } from 'api';

export interface IMessage {
    message: string;
}

export async function sendMessage(message: IMessageForm) {
    return API.post('message/sendMessage', {
        message: {
            ...message
        }
    });
}

export async function getMessages() {
    return API.get<{ messages: IMessage[] }>('message/getMessages');
}

export const io: SocketIOClient.Socket = socketio_client.connect(serverPath);