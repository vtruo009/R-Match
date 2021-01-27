import { getRepository } from 'typeorm';
import { User } from '@entities/user';
import { Student, classStandings } from '@entities/student';
import { Course } from '@entities/course';
import { Department } from '@entities/department';
import { JobApplication } from '@entities/jobApplication';

/**
 * @description Creates a student using an user record from the database
 * @param {User} user - User object used to create the student
 * @returns Promise
 */
export const createStudent = (user: User) => {
    const studentToInsert = Student.create({
        userId: user.id,
    });
    return studentToInsert.save();
};

/**
 * @description Updates an existing student profile in the database
 * @param {number} id - Id of student to update
 * @param {User} user - User object to update
 * @param {number} departmentId - New id of the department that the student belongs to
 * @param {number} sid - New student's sid
 * @param {'Freshman' | 'Sophomore' | 'Junior' | 'Senior'} classStanding - Student's class standing
 * @param {Course[]} courses - New courses of the student
 * @returns Promise
 */
export const updateStudent = async (
    id: Student['id'],
    user: Student['user'],
    departmentId: Student['departmentId'],
    sid: Student['sid'],
    classStanding: Student['classStanding'],
    courses: Student['courses'],
    transcript: Student['transcript'],
    resume: Student['resume']
) => {
    const studentToUpdate = await Student.findOne(id);

    if (!studentToUpdate) return undefined;

    if (departmentId) {
        const departmentObject = await Department.findOne(departmentId);
        if (departmentObject) {
            studentToUpdate.departmentId = departmentId;
            await studentToUpdate.save();
        }
    }

    if (courses) {
        studentToUpdate.courses = [];
        for (const course of courses) {
            const _course = await Course.findOne(course.id);
            if (_course) {
                studentToUpdate.courses.push(course);
            }
        }
        studentToUpdate.save();
    }

    await User.update(user.id, {
        biography: user.biography,
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
    });

    return Student.update(id, {
        sid,
        classStanding,
        resume,
        transcript,
    });
};

/**
 * @description Gets the profile of a student using its id
 * @param {number} id - Id of student's profile to retrieve
 * @returns Promise
 */
export const getStudentProfile = (id: number) => {
    return getRepository(Student)
        .createQueryBuilder('student')
        .where({ id })
        .leftJoin('student.user', 'user')
        .addSelect([
            'user.id',
            'user.firstName',
            'user.lastName',
            'user.middleName',
            'user.biography',
            'user.email',
        ])
        .leftJoinAndSelect('student.department', 'department')
        .leftJoinAndSelect('department.college', 'college')
        .leftJoinAndSelect('student.courses', 'courses')
        .getOne();
};

/**
 * @description Gets all job applications submitted by the student
 * @param {number} studentId - id of student
 * @returns Promise
 */
export const getJobApplications = async (studentId: number) => {
    // Check if a student exists.
    const student = await Student.findOne(studentId);
    if (!student) return undefined;

    // Return all job application submitted by the student.
    return getRepository(JobApplication)
        .createQueryBuilder('jobApplication')
        .where({ studentId })
        .leftJoinAndSelect('jobApplication.job', 'job')
        .leftJoinAndSelect('job.facultyMember', 'facultyMember')
        .leftJoinAndSelect('job.department', 'department')
        .leftJoin('facultyMember.user', 'user')
        .addSelect([
            'user.id',
            'user.firstName',
            'user.lastName',
            'user.middleName',
            'user.biography',
            'user.email',
        ])
        .getMany();
};

export const searchStudents = async (
    firstName: string,
    lastName: string,
    email: string,
    sid: string,
    departmentIds: number[],
    classStandings: classStandings[],
    page: number,
    numOfItems: number
) => {
    return await getRepository(Student)
        .createQueryBuilder('student')
        .leftJoin('student.user', 'user')
        .addSelect([
            'user.id',
            'user.firstName',
            'user.lastName',
            'user.middleName',
            'user.biography',
            'user.email',
        ])
        .leftJoinAndSelect('student.department', 'department')
        .leftJoinAndSelect('department.college', 'college')
        .leftJoinAndSelect('student.courses', 'courses')
        .where('LOWER(user.firstName) LIKE :firstName', {
            firstName: `%${firstName.toLowerCase()}%`,
        })
        .andWhere('LOWER(user.lastName) LIKE :lastName', {
            lastName: `%${lastName.toLowerCase()}%`,
        })
        .andWhere('user.email LIKE :email', {
            email: `%${email}%`,
        })
        .andWhere('((NOT :sidExists) OR (:sidExists AND sid LIKE :sid))', {
            sidExists: sid == "" ? false : true,
            sid: `%${sid}%`,
        })
        .andWhere('(NOT :departmentIdsPopulated OR department.id IN (:...departmentIds))', {
            departmentIdsPopulated: departmentIds[0] != -1,
            departmentIds
        })
        .andWhere('(student.classStanding IS NULL OR student.classStanding IN (:...classStandings))', {
            classStandings
        })
        .skip((page - 1) * numOfItems)
        .take(numOfItems)
        .getManyAndCount()
};