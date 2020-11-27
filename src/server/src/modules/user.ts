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
 * @param role user's role, either 'student' or 'facultyMember'
 * @returns Promise
 */
export const createUser = (
    email: IUser['email'],
    password: IUser['password'],
    firstName: IUser['firstName'],
    lastName: IUser['lastName'],
    role: IUser['role']
) => {
    const repository = getRepository(User);
    const userToInsert = repository.create({
        email,
        password,
        firstName,
        lastName,
        role,
    });
    return repository.save(userToInsert);
};

/**
 * @description registers user's information
 * @param email user's email address
 * @param password user's password (not encrypted)
 * @param firstName user's first name
 * @param lastName user's last name
 * @param role user's role, either 'student' or 'facultyMember'
 * @returns Promise
 */
export const registerUser = async (
    email: IUser['email'],
    password: IUser['password'],
    firstName: IUser['firstName'],
    lastName: IUser['lastName'],
    role: IUser['role']
) => {
    const encryptedPassword = await bcrypt.hash(password, 10);
    // Create user regardless of role
    const newUser = await createUser(
        email,
        encryptedPassword,
        firstName,
        lastName,
        role
    );
    switch (role) {
        case 'student':
            // Inserts information in student table
            return createStudent(newUser);
        case 'facultyMember':
            // Inserts information in facultyMember table
            return createFacultyMember(newUser);
        default:
            return undefined;
    }
};
