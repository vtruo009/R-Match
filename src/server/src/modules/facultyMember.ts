import { getRepository } from 'typeorm';
import { FacultyMember, IFacultyMember } from '@entities/facultyMember';

/**
 * @description Creates a faculty member object and saves it in the database
 * @param email faculty member's email address
 * @param password faculty member's password *
 * @param firstName faculty member's first name
 * @param lastName faculty member's last name
 * @returns Promise
 */
export const createFacultyMember = (
    email: IFacultyMember['email'],
    password: IFacultyMember['password'],
    firstName: IFacultyMember['firstName'],
    lastName: IFacultyMember['lastName']
) => {
    const repository = getRepository(FacultyMember);
    const facultyMemberToInsert = repository.create({
        email,
        password,
        firstName,
        lastName,
    });
    return repository.save(facultyMemberToInsert);
};
