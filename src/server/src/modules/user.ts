import bcrypt from 'bcrypt';
import { User } from '@entities/user';
import { createStudent } from '@modules/student';
import { createFacultyMember } from '@modules/facultyMember';
/**
 * @description Finds user by email
 * @param {string} email - user's email address
 * @returns Promise
 */
export const findUserByEmail = (email: string) => {
    return User.findOne({ email });
};

/**
 * @description Creates a user object and saves it in the database
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @param {string} firstName - User's first name
 * @param {string} lastName - User's last name
 * @param {'student' | 'facultyMember'} role - user's role, either 'student' or 'facultyMember'
 * @returns Promise
 */
export const createUser = (
    email: User['email'],
    password: User['password'],
    firstName: User['firstName'],
    lastName: User['lastName'],
    role: User['role']
) => {
    const userToInsert = User.create({
        email,
        password,
        firstName,
        lastName,
        role,
    });
    return userToInsert.save();
};

/**
 * @description Registers user's information based on their role
 * @param {string} email - User's email address
 * @param {string} password - User's password (not encrypted)
 * @param {string} firstName - User's first name
 * @param {string} lastName - User's last name
 * @param {'student' | 'facultyMember'} role - User's role, either 'student' or 'facultyMember'
 * @returns Promise
 */
export const registerUser = async (
    email: User['email'],
    password: User['password'],
    firstName: User['firstName'],
    lastName: User['lastName'],
    role: User['role']
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
