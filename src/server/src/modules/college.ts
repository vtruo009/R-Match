import { College } from '@entities/college';

/**
 * @description Saves a new college record in the database
 * @param {string} name - name of college to create
 * @returns Promise
 */
export const createCollege = (name: College['name']) => {
    const collegeToInsert = College.create({ name, departments: [] });
    return collegeToInsert.save();
};

/**
 * @description Gets all colleges and their respective departments from the database
 * @returns Promise
 */
export const getColleges = () => {
    return College.find({ relations: ['departments'] });
};

/**
 * @description Deletes a specific college from the database
 * @param {number} id - id of college to delete
 * @returns Promise
 */
export const deleteCollege = (id: College['id']) => {
    return College.delete(id);
};
