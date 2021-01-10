import API from 'api';

export interface IMessage {
    author: string;
    message: string;
    time: string;
}

export async function getMessages() {
    return API.get<{ message: IMessage[] }>('message/loadMessage');
}