import { Message } from '@entities/message';
/**
 * @description Saves a new sample in the database
 * @param {string} message sample's message
 * @param {number} num - sample's number
 * @returns Promise
 */
export const createMessage = (
    message: Message['message']
) => {
    const messageToInsert = Message.create({
        message,
    });
    return messageToInsert.save();
};

/**
 * @description Gets all sample documents from the database
 * @returns Promise<Sample[]>
 */
export const getMessages = () => {
    return Message.find();
};
