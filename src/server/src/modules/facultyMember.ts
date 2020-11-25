import { getRepository } from 'typeorm';
import { FacultyMember } from '@entities/facultyMember';
import { IUser } from '@entities/user';

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
 * @description saves a new faculty member profile in the database
 * @param email string
 * @param biography string
 * @param firstName string
 * @param middleName string
 * @param lastName string
 * @param departmentId string
 * @param websiteLink string
 * @param office string
 * @param title string
 * @returns Promise
 */
export const updateFacultyMember = (
    email: IFacultyMember['email'],
    biography: IFacultyMember['biography'],
    firstName: IFacultyMember['firstName'],
    middleName: IFacultyMember['middleName'],
    lastName: IFacultyMember['lastName'],
    departmentId: IFacultyMember['departmentId'],
    websiteLink: IFacultyMember['websiteLink'],
    office: IFacultyMember['office'],
    title: IFacultyMember['title'],
) => {

    const repository = getRepository(FacultyMember);
    const facultyMemberToInsert = repository.create({
        email,
        biography,
        firstName,
        middleName,
        lastName,
        departmentId,
        websiteLink,
        office,
        title
    });
    return repository.save(facultyMemberToInsert);
};
