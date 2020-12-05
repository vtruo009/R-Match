import { ICollege, College } from '@entities/college';
import { getRepository } from 'typeorm';
/**
 * @description saves a new college in the database
 * @param name string
 * @returns Promise
 */
export const createcollege = async (
    name: ICollege['name']
) => {
    const college = new College();
    college.name = name;
    college.departments = [];
    await getRepository(College).save(college);
};
