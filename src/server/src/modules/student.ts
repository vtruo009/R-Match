import { getRepository } from 'typeorm';
import { Student, IStudent } from '@entities/student';

/**
 * @description Creates a student  object and saves it in the database
 * @param email student's email address
 * @param password student's password *
 * @param firstName student's first name
 * @param lastName student's last name
 * @returns Promise
 */
export const createStudent = (
    email: IStudent['email'],
    password: IStudent['password'],
    firstName: IStudent['firstName'],
    lastName: IStudent['lastName']
) => {
    const repository = getRepository(Student);
    const studentToInsert = repository.create({
        email,
        password,
        firstName,
        lastName,
    });
    return repository.save(studentToInsert);
};
