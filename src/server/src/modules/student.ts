import { getRepository } from 'typeorm';
import { Student } from '@entities/student';
import { IUser, User } from '@entities/user';
import { IStudent } from '@entities/student';
import { Department } from '@entities/department';

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
 * @param department Department
 * @param sid number
 * @param classStanding 'freshman' | 'sophomore' | 'junior' | 'senior'
 * @returns Promise
 */
export const updateStudent = async (
    user: IStudent['user'],
    department: IStudent['department'],
    sid: IStudent['sid'],
    classStanding: IStudent['classStanding'],
    id: number
) => {
    const studentRepository = getRepository(Student);
    const departmentRepository = getRepository(Department);
    const userRepository = getRepository(User);

    const studentToUpdate = await studentRepository.findOne(id);
    if (studentToUpdate !== undefined) {
        if (department !== undefined) {
            const departmentObject = await departmentRepository.findOne(department.id)
            if (departmentObject !== undefined) {
                studentToUpdate.department = departmentObject;
                await studentRepository.save(studentToUpdate);
            }
        }

        await userRepository.update(user.id, {
            biography: user.biography,
            firstName: user.firstName,
            middleName: user.middleName,
            lastName: user.lastName,
        });

        return studentRepository.update(id, {
            sid,
            classStanding,
        });
    }
    return undefined;
};

