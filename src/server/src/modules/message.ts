import { Message } from '@entities/message';
import { User } from '@entities/user';
import { getRepository } from 'typeorm';
/**
 * @description Saves a new sample in the database
 * @param {string} message sample's message
 * @param {number} num - sample's number
 * @returns Promise
 */
export const sendMessage = (
    message: Message['message'],
    receiverId: Message['receiverId'],
    senderId: Message['senderId']
) => {
    console.log("Sender ID: " + senderId);
    const messageToInsert = Message.create({
        message: message,
        senderId: senderId,
        receiverId: receiverId,
        date: new Date(),
    });
    return messageToInsert.save();
};

/**
 * @description Gets all messages between two users.
 * @returns Promise<Sample[]>
 */
export const getMessages = async (userID1: number, userId2: number) => {
    return await getRepository(Message)
        .createQueryBuilder('message')
        .where("sender.id = :id1 AND receiver.id = :id2",
            { id1: userID1, id2: userId2 })
        .where("sender.id = :id1 AND receiver.id = :id2",
            { id1: userId2, id2: userID1 })
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
};

// Return all users who has communicated with the user.
export const getCommunicatedUsers = async (usedId: number) => {
    const messages = await getRepository(Message)
        .createQueryBuilder('message')
        .where("sender.id = :id", { id: usedId })
        .orWhere("receiver.id = :id", { id: usedId })
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

    var users: User[]
    users = []

    for (let message of messages) {
        if (!users.some(({ id }) => id === message.sender.id) && message.sender.id != usedId) {
            users.push(message.sender);
        }
        if (!users.some(({ id }) => id === message.receiver.id) && message.receiver.id != usedId) {
            users.push(message.receiver);
        }
    }

    return users;
};
