import { IFacultyMember, FacultyMember } from '@entities/facultyMember';
import { getRepository } from 'typeorm';
import { promises } from 'fs-extra';
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
export const createFacultyMember = (
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