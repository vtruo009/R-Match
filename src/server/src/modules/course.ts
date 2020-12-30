import { Course } from '@entities/course';
import { findDepartment } from '@modules/department';
/**
 * @description Saves a new course record in the database
 * @param {string} shortTitle - Short title of the course to create
 * @param {string} fullTitle - Full title of the course to create
 * @param {number} departmentId - Id of the department related to the course
 * @returns Promise
 */
export const createCourse = async (
    shortTitle: Course['shortTitle'],
    fullTitle: Course['fullTitle'],
    departmentId: Course['departmentId']
) => {
    const department = await findDepartment(departmentId);
    if (!department) return undefined;
    const courseToInsert = Course.create({
        shortTitle,
        fullTitle,
        departmentId,
    });
    return courseToInsert.save();
};

export const getCourseByDepartmentId = (
    departmentId: Course['departmentId']
) => {
    return Course.find({ where: { departmentId } });
};
