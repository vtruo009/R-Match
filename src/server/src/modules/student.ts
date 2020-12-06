import { getRepository } from 'typeorm';
import { Student } from '@entities/student';
import { IUser, User } from '@entities/user';
import { IStudent } from '@entities/student';

/**
 * @description Creates a student using an user record from the database
 * @param user user object
 * @returns Promise
 */
export const createStudent = async (user: IUser) => {
    const studentRepository = getRepository(Student);
    const studentToInsert = studentRepository.create({
        user,
    });

    return studentRepository.save(studentToInsert);
};

/**
 * @description updates an existing student profile in the database
 * @param id number
 * @param user User
 * @param departmentId string
 * @param sid number
 * @param classStanding 'freshman' | 'sophomore' | 'junior' | 'senior'
 * @returns Promise
 */
export const updateStudent = async (
    user: IStudent['user'],
    departmentId: IStudent['departmentId'],
    sid: IStudent['sid'],
    classStanding: IStudent['classStanding'],
    id: number
) => {
    const studentToUpdate = await getRepository(Student).findOne(id);
    if (studentToUpdate !== undefined) {
        await getRepository(User).update(user.id, {
            biography: user.biography,
            firstName: user.firstName,
            middleName: user.middleName,
            lastName: user.lastName,
        });
        return getRepository(Student).update(id, {
            departmentId,
            sid,
            classStanding
        });
    }
    return undefined;
};

