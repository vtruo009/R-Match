import API from 'api';
<<<<<<< HEAD
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

export interface IConversation {
    user: IUser;
    latestMessage: IMessage;
}

export async function sendMessage(message: IMessageForm, receiver?: IUser) {
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

export function getDateString(dateString: string) {
    const date = new Date(dateString);

    const dateNow = new Date();

    // If same date, return time.
    if (date.getMonth() === dateNow.getMonth()
        && date.getDate() === dateNow.getDate()
        && date.getFullYear() === dateNow.getFullYear()) {
        var hour = date.getHours();
        var abbreviation = 'am';
        if (hour >= 12) {
            if (hour > 12) hour -= 12;
            abbreviation = 'pm';
        }
        return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')} ${abbreviation}`;
    }

    // If same year, return only month and date.
    if (date.getFullYear() === dateNow.getFullYear())
        return `${date.getMonth() + 1}/${date.getDate()}`;

    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
};

export const io: SocketIOClient.Socket = socketio_client.connect(serverPath);
=======
import { IMessaging } from 'Domains/Messages/Messaging'; 

export const roles = [
    {
        label: 'Faculty member',
        value: 'facultyMember',
    },
    {
        label: 'Student',
        value: 'student',
    },
];

export interface IUser {
    id: number;
    email: string;
    biography?: string;
    firstName: string;
    lastName: string;
    middleName?: string;
    role: 'student' | 'facultyMember';
}

export async function signUp(signUpData: IMessaging) {
    return API.post<{ error: string }>('user/sign-up', {
        user: { ...signUpData },
    });
}
>>>>>>> Initial commit
