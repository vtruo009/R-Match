import { College } from '@entities/college';
// import { getRepository } from 'typeorm';
/**
 * @description saves a new college in the database
 * @param name string
 * @returns Promise
 */
export const createCollege = async (name: College['name']) => {
    // const repository = getRepository(College);
    const collegeToInsert = new College();
    collegeToInsert.name = name;
    collegeToInsert.departments = [];
    return collegeToInsert.save();
};

export const getColleges = async () => {
    return College.find({ relations: ['departments'] });
};
