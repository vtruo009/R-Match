import { Message } from '@entities/message';
import { User } from '@entities/user';
import { getRepository } from 'typeorm';
import {
    userIdExists,
    findUserByEmail,
    hidePassword,
    getUserById,
} from '@modules/user';
import { sendEmail } from '@lib/mail';

/**
 * @description Send a message to a receiver.
 * @param {string} content - Message text
 * @param {number} receiverId - User Id of the receiver
 * @param {number} senderId - User Id of the sender
 * @returns Promise
 */
export const sendMessage = async (
    content: Message['content'],
    receiverId: Message['receiverId'],
    senderId: Message['senderId']
) => {
    const sendMessageResult: {
        result: Message | undefined;
        errorMessage: string;
    } = {
        result: undefined,
        errorMessage: '',
    };

    if (senderId === receiverId) {
        sendMessageResult.errorMessage =
            'Sender should be different from receiver.';
        return sendMessageResult;
    }

    // Get sender user object
    const getSenderByIdResult = await getUserById(senderId);
    if (!getSenderByIdResult.result) {
        sendMessageResult.errorMessage = `Error while obtaining sender profile: ${getSenderByIdResult.message}`;
        return sendMessageResult;
    }
    const sender = getSenderByIdResult.result;

    // Get receiver user object
    const getReceiverIdResult = await getUserById(receiverId);
    if (!getReceiverIdResult.result) {
        sendMessageResult.errorMessage = `Error while obtaining receiver profile: ${getReceiverIdResult.message}`;
        return sendMessageResult;
    }
    const receiver = getReceiverIdResult.result;

    // Send email.
    sendEmail(
        receiver.email,
        `${sender.firstName} ${sender.lastName} just messaged you`,
        `You have new message from ${sender.firstName} ${sender.lastName}.\n    ${sender.firstName}: ${content}`
    );

    // Insert Message object.
    const messageToInsert = Message.create({
        content: content,
        senderId: senderId,
        receiverId: receiverId,
        date: new Date(),
    });

    messageToInsert.save();

    sendMessageResult.errorMessage = 'Successful';
    sendMessageResult.result = messageToInsert;

    return sendMessageResult;
};

/**
 * @description Get top [20 * page] newest messages between two users,
 *              sorted from the oldest to the newest
 * @param {number} userID1 - id of the first user.
 * @param {number} userId2 - id of the second user.
 * @param {number} page - page index.
 * @returns Promise
 */
export const getMessages = async (
    userId1: number,
    userId2: number,
    page: number
) => {
    const getMessagesResult: {
        result?: [Message[], number];
        errorMessage: string;
    } = {
        result: undefined,
        errorMessage: '',
    };

    // Check if user with the id userId1 exists.
    if (!userIdExists(userId1)) {
        getMessagesResult.errorMessage = `User with id ${userId1} does not exist.`;
        return getMessagesResult;
    }

    // Check if user with the id userId2 exists.
    if (!userIdExists(userId2)) {
        getMessagesResult.errorMessage = `User with id ${userId2} does not exist.`;
        return getMessagesResult;
    }

    const queryResult = await getRepository(Message)
        .createQueryBuilder('message')
        .setParameters({ id1: userId1, id2: userId2 })
        .where('sender.id = :id1 AND receiver.id = :id2')
        .orWhere('sender.id = :id2 AND receiver.id = :id1')
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
        // Order from the newest to the oldest.
        .orderBy('message.date', 'DESC')
        // Take top [page * 20] newest elements.
        .take(page * 20)
        .getManyAndCount();

    const [messages, messagesCount] = queryResult;

    getMessagesResult.errorMessage = 'Successful';
    // Reverse messages to order the messages from the oldest to the newest.
    getMessagesResult.result = [messages.reverse(), messagesCount];

    return getMessagesResult;
};

/**
 * @description Get an array of Users who have communicated with the user with the given id
 *              and the latest message between each user and the user with the given id.
 * @param {number} userId - id of the user.
 * @returns Promise
 */
export const getConversationList = async (userId: number) => {
    const getConversationListResult: {
        result: { user: User; latestMessage: Message }[] | undefined;
        errorMessage: string;
    } = {
        result: undefined,
        errorMessage: '',
    };

    if (!userIdExists(userId)) {
        getConversationListResult.errorMessage = `User with id ${userId} does not exist.`;
        return getConversationListResult;
    }

    // Get all messages sent or received by the user.
    const messages = await getRepository(Message)
        .createQueryBuilder('message')
        .where('sender.id = :id', { id: userId })
        .orWhere('receiver.id = :id', { id: userId })
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

    // Get all users who have communicated with the user.
    var users: User[];
    users = [];
    for (const message of messages) {
        if (
            !users.some(({ id }) => id === message.sender.id) &&
            message.sender.id != userId
        ) {
            users.push(message.sender);
        }
        if (
            !users.some(({ id }) => id === message.receiver.id) &&
            message.receiver.id != userId
        ) {
            users.push(message.receiver);
        }
    }

    // Get the latest message between each user and the logged-in user.
    var unsortedConversationList: { user: User; latestMessage: Message }[];
    unsortedConversationList = [];
    for (const user of users) {
        const getMessagesResult = await getMessages(user.id, userId, 1);
        if (!getMessagesResult.result) {
            getConversationListResult.errorMessage =
                getMessagesResult.errorMessage;
            return getConversationListResult;
        }

        const [messages] = getMessagesResult.result;

        const latestMessage = messages.reduce(function (prev, current) {
            return prev.date > current.date ? prev : current;
        });
        unsortedConversationList.push({
            user: user,
            latestMessage: latestMessage,
        });
    }

    // Sort the conversations from the newst to the oldest.
    getConversationListResult.result = unsortedConversationList.sort(
        (conversation1, conversation2) =>
            conversation2.latestMessage.date.getTime() -
            conversation1.latestMessage.date.getTime()
    );

    return getConversationListResult;
};

/**
 * @description Returns a user object with the email to initiate a message.
 * @param {number} userId - id of the logged-in user.
 * @param {string} email - email address.
 * @returns Promise
 */
export const getUserByEmail = async (userId: number, email: string) => {
    const getUserByEmailResult: {
        result: User | undefined;
        message: string;
    } = {
        result: undefined,
        message: '',
    };

    const receiver = await findUserByEmail(email);

    // Check if the user with the email exists.
    if (!receiver) {
        getUserByEmailResult.message = `User with email ${email} does not exist.`;
        return getUserByEmailResult;
    }

    if (receiver.id === userId) {
        getUserByEmailResult.message = 'You cannot send message to yourself.';
        return getUserByEmailResult;
    }

    const getUserByIdResult = await hidePassword(receiver);

    getUserByEmailResult.message = 'Successful';
    getUserByEmailResult.result = getUserByIdResult;

    return getUserByEmailResult;
};
