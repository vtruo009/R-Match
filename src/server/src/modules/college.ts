import { ICollege, College } from '@entities/college';
import { getRepository } from 'typeorm';
/**
 * @description saves a new college in the database
 * @param name string
 * @returns Promise
 */
export const createCollege = async (
    name: ICollege['name']
) => {
    const repository = getRepository(College);
    const collegeToInsert = repository.create({
        name,
        departments: [],
    });
    return repository.save(collegeToInsert);
};
