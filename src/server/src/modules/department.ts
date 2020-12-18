import { Department } from '@entities/department';
import { College } from '@entities/college';

/**
 * @description Saves a new department record in the database
 * @param {string} name - Name of department to create
 * @param {number} collegeId - Id of college related to the department to create
 * @returns Promise
 */
export const createDepartment = async (
    name: Department['name'],
    collegeId: Department['collegeId']
) => {
    const collegeObject = await College.findOne(collegeId);
    if (!collegeObject) return undefined;
    const department = Department.create({
        name,
        collegeId,
    });
    return department.save();
};

/**
 * @description Gets all departments and their respective colleges from the database
 * @returns Promise
 */
export const getDepartments = () => {
    return Department.find({ relations: ['college'] });
};

/**
 * @description Deletes a specific department from the database
 * @param {number} id - id of the department to delete
 * @returns Promise
 */
export const deleteDepartment = (id: Department['id']) => {
    return Department.delete(id);
};

/**
 * @description Finds a department by id
 * @param {number} id - id of the department to find
 * @returns Promise
 */
export const findDepartment = (id: Department['id']) => {
    return Department.findOne(id);
};
