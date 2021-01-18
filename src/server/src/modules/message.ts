import { Message } from '@entities/message';
import { User } from '@entities/user';
import { getRepository } from 'typeorm';

/**
 * @description Return a boolean value checking if the user with the given id exist.
 * @param {number} userId - id of the user.
 * @returns Promise
 */
const userIdExists = async (userId: number) => {
    const user = await getRepository(User)
        .createQueryBuilder('user')
        .where({ id: userId })
        .getOne();
    return user !== undefined;
}

/**
 * @description Send a message to a receiver.
 * @param {string} message - Message text
 * @param {number} receiverId - User Id of the receiver
 * @param {number} senderId - User Id of the sender
 * @returns Promise
 */
export const sendMessage = async (
    message: Message['message'],
    receiverId: Message['receiverId'],
    senderId: Message['senderId']
) => {
    const sendMessageResult: {
        result: Message | undefined,
        errorMessage: string;
    } = {
        result: undefined,
        errorMessage: '',
    };

    // Check if receiver exists.
    if (!userIdExists(receiverId)) {
        sendMessageResult.errorMessage = "Receiver does not exist.";
        return sendMessageResult;
    }

    // Check if sender exists.
    if (!userIdExists(senderId)) {
        sendMessageResult.errorMessage = "Sender does not exist.";
        return sendMessageResult;
    }

    const messageToInsert = Message.create({
        message: message,
        senderId: senderId,
        receiverId: receiverId,
        date: new Date(),
    });

    messageToInsert.save();

    sendMessageResult.errorMessage = "Successful";
    sendMessageResult.result = messageToInsert;

    return sendMessageResult;
};

/**
 * @description Get all messages between two users.
 * @param {number} userID1 - id of the first user.
 * @param {number} userId2 - id of the second user.
 * @returns Promise
 */
export const getMessages = async (userId1: number, userId2: number) => {
    const getMessagesResult: {
        result: Message[] | undefined,
        errorMessage: string;
    } = {
        result: undefined,
        errorMessage: '',
    };

    console.log("User 1: " + userId1);
    console.log("User 2: " + userId2);

    // Check if user with the id userId1 exists.
    if (!userIdExists(userId1)) {
        getMessagesResult.errorMessage = `A user with id ${userId1} does not exist.`;
        return getMessagesResult;
    }

    // Check if user with the id userId2 exists.
    if (!userIdExists(userId2)) {
        getMessagesResult.errorMessage = `A user with id ${userId2} does not exist.`;
        return getMessagesResult;
    }

    const messages = await getRepository(Message)
        .createQueryBuilder('message')
        .setParameters({ id1: userId1, id2: userId2 })
        .where("sender.id = :id1 AND receiver.id = :id2")
        .orWhere("sender.id = :id2 AND receiver.id = :id1")
        .leftJoin('message.sender', 'sender')
        .leftJoin('message.receiver', 'receiver')
        .addSelect([
            'sender.id',
            'sender.firstName',
            'sender.lastName',
            'sender.middleName',
            'sender.biography',
            'sender.email',
        ])
        .addSelect([
            'receiver.id',
            'receiver.firstName',
            'receiver.lastName',
            'receiver.middleName',
            'receiver.biography',
            'receiver.email',
        ])
        .orderBy('message.date', 'ASC')
        .getMany();

    console.log("MESSAGE NUMBER: " + messages.length);

    getMessagesResult.errorMessage = "N/A";
    getMessagesResult.result = messages;

    return getMessagesResult;
};

/**
 * @description Get an array of User who has communicated with the user with the given id.
 * @param {number} userId - id of the user.
 * @returns Promise
 */
export const getConversationList = async (userId: number) => {
    const getConversationListResult: {
        result: any;
        errorMessage: string;
    } = {
        result: undefined,
        errorMessage: '',
    };

    if (!userIdExists(userId)) {
        getConversationListResult.errorMessage = `A user with id ${userId} does not exist.`;
        return getConversationListResult;
    }

    // Get all messages sent or received by the user.
    const messages = await getRepository(Message)
        .createQueryBuilder('message')
        .where("sender.id = :id", { id: userId })
        .orWhere("receiver.id = :id", { id: userId })
        .leftJoin('message.sender', 'sender')
        .leftJoin('message.receiver', 'receiver')
        .addSelect([
            'sender.id',
            'sender.firstName',
            'sender.lastName',
            'sender.middleName',
            'sender.biography',
            'sender.email',
        ])
        .addSelect([
            'receiver.id',
            'receiver.firstName',
            'receiver.lastName',
            'receiver.middleName',
            'receiver.biography',
            'receiver.email',
        ])
        .getMany();

    // Get all users who have communicated with the logged-in user.
    var users: User[]
    users = []

    for (let message of messages) {
        if (!users.some(({ id }) => id === message.sender.id) && message.sender.id != userId) {
            users.push(message.sender);
        }
        if (!users.some(({ id }) => id === message.receiver.id) && message.receiver.id != userId) {
            users.push(message.receiver);
        }
    }

    var unsortedConversationList = [];

    for (let user of users) {
        const getMessagesResult = await getMessages(user.id, userId);
        if (!getMessagesResult.result) {
            getConversationListResult.errorMessage = getMessagesResult.errorMessage;
            return getConversationListResult;
        }
        const latestMessage = getMessagesResult.result.reduce(function (prev, current) {
            return (prev.date > current.date) ? prev : current
        })
        unsortedConversationList.push({ user: user, latestMessage: latestMessage });
    }

    getConversationListResult.result =
        unsortedConversationList.sort((conversation1, conversation2) =>
            conversation2.latestMessage.date.getTime() - conversation1.latestMessage.date.getTime());

    return getConversationListResult;
};
