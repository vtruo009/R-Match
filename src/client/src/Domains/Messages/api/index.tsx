import API from 'api';
import * as socketio_client from 'socket.io-client';
import { IMessageSendForm } from 'Domains/Messages/MessageSendForm';
import { INewMessageForm } from 'Domains/Messages/NewMessageForm';
import { IUser } from 'Domains/Accounts/api';

export interface IMessage {
    message: string;
    sender: IUser;
    receiver: IUser;
    date: string;
}

export interface IConversation {
    user: IUser;
    latestMessage: IMessage;
}

export async function sendMessage(message: IMessageSendForm, receiver?: IUser) {
    return API.post('message/sendMessage', {
        message: message.message,
        receiverId: receiver?.id
    });
}

export async function getMessages(messenger?: IUser) {
    return API.get<{ messages: IMessage[] }>(`message/getMessages/${messenger?.id}`);
}

export async function getConversationList() {
    return API.get<{ conversationList: IConversation[] }>('message/getConversationList');
}

export async function createMessage(newMessageForm: INewMessageForm) {
    return API.get < { user: IUser, error: string } >(`user/get-by-email/${newMessageForm.email}`);
}

const serverPath = 'http://localhost:5000/';

export const io: SocketIOClient.Socket = socketio_client.connect(serverPath);