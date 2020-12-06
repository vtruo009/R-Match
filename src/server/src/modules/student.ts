import { getRepository } from 'typeorm';
import { Student } from '@entities/student';
import { IUser, User } from '@entities/user';
import { IStudent } from '@entities/student';
import { Course } from '../entities/course';

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
    courses: IStudent['courses'],
    id: number
) => {
    const studentRepository = getRepository(Student);
    const courseRepository = getRepository(Course);
    const studentToUpdate = await studentRepository.findOne(id);
    if (studentToUpdate !== undefined) {
        if (courses !== undefined) {
            studentToUpdate.courses = [];
            courses.forEach(async (item: any, index: any) => {
                // Check if the course exists.
                const course = await courseRepository.findOne(
                    { where: { title: item.title } });
                // If the course does not exist, create new course.
                if (course === undefined) {
                    const newCourse = new Course();
                    newCourse.title = item.title;
                    await courseRepository.save(newCourse);
                    item = newCourse;
                    studentToUpdate.courses.push(newCourse);
                } else {
                    studentToUpdate.courses.push(course);
                }
            })
            await studentRepository.save(studentToUpdate);
        }
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

