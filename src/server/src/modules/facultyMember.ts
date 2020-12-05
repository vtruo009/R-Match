import { getRepository } from 'typeorm';
import { FacultyMember } from '@entities/facultyMember';
import { IUser, User } from '@entities/user';
import { IFacultyMember } from '@entities/facultyMember';
import { Department } from '@entities/department';

/**
 * @description Creates a faculty member using an existing user record from the database
 * @param user user object
 * @returns Promise
 */
export const createFacultyMember = (user: IUser) => {
    const facultyMemberRepository = getRepository(FacultyMember);
    const facultyMemberToInsert = facultyMemberRepository.create({
        user,
    });
    return facultyMemberRepository.save(facultyMemberToInsert);
};

/**
 * @description updates an existing faculty member profile in the database
 * @param id number
 * @param user User
 * @param department Department
 * @param websiteLink string
 * @param office string
 * @param title string
 * @returns Promise
 */
export const updateFacultyMember = async (
    user: IFacultyMember['user'],
    department: IFacultyMember['department'],
    websiteLink: IFacultyMember['websiteLink'],
    office: IFacultyMember['office'],
    title: IFacultyMember['title'],
    id: number
) => {
    const departmentRepository = await getRepository(Department);
    const facultyMemberRepository = await getRepository(FacultyMember);

    const facultyToUpdate = await facultyMemberRepository.findOne(id);
    if (facultyToUpdate !== undefined) {
        if (department !== undefined) {
            const departmentObject = await departmentRepository.findOne(department.id)
            if (departmentObject !== undefined) {
                facultyToUpdate.department = departmentObject;
                await facultyMemberRepository.save(facultyToUpdate);
            }
        }

        await getRepository(User).update(user.id, {
            biography: user.biography,
            firstName: user.firstName,
            middleName: user.middleName,
            lastName: user.lastName,
        });
        return await facultyMemberRepository.update(id, {
            department,
            websiteLink,
            office,
            title,
        });
    }
    return undefined;
};
