import bcrypt from 'bcrypt';
import { User } from '@entities/user';
import { createStudent } from '@modules/student';
import { createFacultyMember } from '@modules/facultyMember';
import { getRepository } from 'typeorm';

/**
 * @description Return a boolean value checking if the user with the given id exists.
 * @param {number} userId - id of the user.
 * @returns Promise
 */
export const userIdExists = async (userId: number) => {
    const user = await getRepository(User)
        .createQueryBuilder('user')
        .where({ id: userId })
        .getOne();
    return user !== undefined;
}

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
 * @param {role} role - user's role, either 'student' or 'facultyMember'
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
 * @param {role} role - User's role, either 'student' or 'facultyMember'
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

/**
 * @description Returns an user object corresponding to email in order to send a message.
 * @param {number} userId - id of the logged-in user.
 * @param {string} email - email address.
 * @returns Promise
 */
export const getUserByEmail = async (userId: number, email: string) => {
    const getUserByEmailResult: {
        result: User | undefined;
        message: string;
    } = {
        result: undefined,
        message: '',
    };

    const receiver = await findUserByEmail(email)

    // Check if the user with the email exists.
    if (!receiver) {
        getUserByEmailResult.message =
            'A user with the email does not exist.';
        return getUserByEmailResult;
    }

    if (receiver.id == userId) {
        getUserByEmailResult.message =
            'You cannot send message to yourself.';
        return getUserByEmailResult;
    }

    getUserByEmailResult.message = 'Successful';

    const getUserByIdResult = await getUserById(receiver.id)

    if (!getUserByIdResult.result) {
        getUserByEmailResult.message =
            getUserByIdResult.message;
        return getUserByEmailResult;
    }

    getUserByEmailResult.result = getUserByIdResult.result

    return getUserByEmailResult;
};

/**
 * @description Returns an user object corresponding to the input userId.
 * @param {number} userId - id of the requested user.
 * @returns Promise
 */
export const getUserById = async (userId: number) => {
    const getUserByIdResult: {
        result: User | undefined;
        message: string;
    } = {
        result: undefined,
        message: '',
    };

    // Check if the user with the email exists.
    const user = await getRepository(User)
        .createQueryBuilder('user')
        .where({ id: userId })
        .select([
            'user.id',
            'user.firstName',
            'user.lastName',
            'user.middleName',
            'user.biography',
            'user.email',
        ])
        .getOne();

    if (!user) {
        getUserByIdResult.message =
            'A user with the id does not exist.';
        return getUserByIdResult;
    }

    getUserByIdResult.message = 'Successful';
    getUserByIdResult.result = user;

    return getUserByIdResult;
};

