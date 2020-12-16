import { Department } from '@entities/department';
import { College } from '@entities/college';
import { getRepository } from 'typeorm';

/**
 * @description saves a new department in the database
 * @param name string
 * @param college College
 * @returns Promise
 */
export const createDepartment = async (
    name: Department['name'],
    college: Department['college']
) => {
    const collegeObject = await College.findOne(college.id);
    if (collegeObject !== undefined) {
        const department = new Department();
        department.name = name;
        department.college = collegeObject;
        return department.save();
    }
};
