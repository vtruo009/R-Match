import API from 'api';
import { IMessageForm } from 'Domains/Messages/SendMessageForm';
import { INewMessageForm } from 'Domains/Messages/NewMessageForm';
import { IUser } from 'Domains/Accounts/api/api';
import * as socketio_client from 'socket.io-client';
import { serverPath } from 'api';
import Axios from 'axios';

export interface IMessage {
    message: string;
    sender: IUser;
    receiver: IUser;
    date: string;
}

export async function sendMessage(message: IMessageForm, receiver?: IUser) {
    return API.post('message/sendMessage', {
        message: message.message,
        receiverId: receiver?.id
    });
}

export async function getMessages(peer?: IUser) {
    alert("GET MESSAGES!");
    return API.get<{ messages: IMessage[] }>(`message/getMessages/${peer?.id}`);
}

export async function getCommunicatedUsers() {
    return API.get<{ users: IUser[] }>('message/getPastMessageSenders');
}

export async function createMessage(newMessageForm: INewMessageForm) {
    return API.get < { user: IUser, error: string } >(`user/get-by-email/${newMessageForm.email}`);
}

export const io: SocketIOClient.Socket = socketio_client.connect(serverPath);