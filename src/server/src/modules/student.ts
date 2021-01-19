import { getRepository } from 'typeorm';
import { User } from '@entities/user';
import { Student } from '@entities/student';
import { Course } from '@entities/course';
import { Job } from '@entities/job';
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
 * @description Saves a student's job application in the database.
 * @param {number} studentId - Id of student that submits the application
 * @param {number} jobId - Id of job that students apply to
 * @returns Promise
 */
export const applyToJob = async (studentId: number, jobId: number) => {
    const applicationResult: {
        result: JobApplication | undefined;
        message: string;
    } = {
        result: undefined,
        message: '',
    };

    // Check if student exists.
    const student = await Student.findOne(studentId);
    if (!student) {
        applicationResult.message = 'Student does not exist';
        return applicationResult;
    }

    // Check if job exists.
    const job = await Job.findOne(jobId);
    if (!job) {
        applicationResult.message = 'Requested job does not exist';
        return applicationResult;
    }

    // Check if student already applied for the job.
    const application = await JobApplication.findOne({
        where: { jobId, studentId },
    });

    if (application) {
        applicationResult.message =
            'Student has already applied for the position';
        return applicationResult;
    }

    // Creates a new job application object and saves it
    const jobApplication = await JobApplication.create({
        studentId,
        jobId,
        date: new Date(),
    }).save();

    applicationResult.message = 'Job application successfully submitted';
    applicationResult.result = jobApplication;
    return applicationResult;
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
