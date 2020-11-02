import { ISample, Sample } from '@entities/sample';
import { getRepository } from 'typeorm';
/**
 * @description saves a new sample in the database
 * @param message sample message
 * @param num sample number
 * @returns Promise
 */
export const createSample = (
    message: ISample['message'],
    num: ISample['num']
) => {
    const repository = getRepository(Sample);
    const sampleToInsert = repository.create({
        num,
        message,
    });
    return repository.save(sampleToInsert);
};

/**
 * @description gets all sample documents from the database
 * @returns Promise<Sample[]>
 */
export const getSamples = () => {
    return getRepository(Sample).find();
};
/**
 * @description updates an existing sample from the database
 * @param newMessage sample message
 * @param newNum sample number
 * @returns Promise
 */
export const updateSample = (
    newMessage: ISample['message'],
    newNum: ISample['num'],
    id: number
) => {
    return getRepository(Sample).update(id, {
        message: newMessage,
        num: newNum,
    });
};

/**
 * @description deletes an existing sample from the database
 * @param id sample's unique identifier
 * @returns Promise
 */
export const deleteSample = (id: number) => {
    // return sample.findByIdAndDelete(_id);
    return getRepository(Sample).delete(id);
};
