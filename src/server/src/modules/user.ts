import bcrypt from 'bcrypt';
import { getRepository } from 'typeorm';
import { IUser, User } from '@entities/user';
import { createStudent } from '@modules/student';
import { createFacultyMember } from '@modules/facultyMember';
/**
 * @description Finds user by email
 * @param email user's email address
 * @returns Promise
 */
export const findUserByEmail = (email: string) => {
    return getRepository(User).findOne({ email });
};

/**
 * @description Creates a user  object and saves it in the database
 * @param email user's email address
 * @param password user's password *
 * @param firstName user's first name
 * @param lastName user's last name
 * @returns Promise
 */
export const createUser = (
    email: IUser['email'],
    password: IUser['password'],
    firstName: IUser['firstName'],
    lastName: IUser['lastName']
) => {
    const repository = getRepository(User);
    const userToInsert = repository.create({
        email,
        password,
        firstName,
        lastName,
    });
    return repository.save(userToInsert);
};

export const registerUser = async (
    email: IUser['email'],
    password: IUser['password'],
    firstName: IUser['firstName'],
    lastName: IUser['lastName'],
    role: 'student' | 'facultyMember'
) => {
    const encryptedPassword = await bcrypt.hash(password, 10);
    switch (role) {
        case 'student':
            // Inserts information in Student table
            return createStudent(email, encryptedPassword, firstName, lastName);
        case 'facultyMember':
            // Inserts information in facultyMember table
            return createFacultyMember(
                email,
                encryptedPassword,
                firstName,
                lastName
            );
        default:
            // Inserts information in user table?
            return createUser(email, encryptedPassword, firstName, lastName);
    }
};
