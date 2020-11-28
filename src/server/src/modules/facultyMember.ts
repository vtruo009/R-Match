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
