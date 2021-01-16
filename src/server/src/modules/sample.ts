import { Sample } from '@entities/sample';

/**
 * @description Saves a new sample in the database
 * @param {string} message sample's message
 * @param {number} num - sample's number
 * @returns Promise
 */
export const createSample = (
    message: Sample['message'],
    num: Sample['num']
) => {
    const sampleToInsert = Sample.create({
        num,
        message,
    });
    return sampleToInsert.save();
};

/**
 * @description Gets all sample documents from the database
 * @returns Promise<Sample[]>
 */
export const getSamples = () => {
    return Sample.find();
};

/**
 * @description Updates an existing sample from the database
 * @param {string} newMessage new sample's message
 * @param {number} newNum - new sample's number
 * @returns Promise
 */
export const updateSample = (
    newMessage: Sample['message'],
    newNum: Sample['num'],
    id: Sample['id']
) => {
    return Sample.update(id, {
        message: newMessage,
        num: newNum,
    });
};

/**
 * @description Deletes an existing sample from the database
 * @param {number} id  - Id of  sample to delete
 * @returns Promise
 */
export const deleteSample = (id: number) => {
    // return sample.findByIdAndDelete(_id);
    return Sample.delete(id);
};
