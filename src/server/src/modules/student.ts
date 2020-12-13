import { getRepository } from 'typeorm';
import { IUser, User } from '@entities/user';
import { IStudent, Student } from '@entities/student';
import { Course } from '@entities/course';
import { Job } from '@entities/job';
import { Department } from '@entities/department';
import { JobApplication } from '@entities/jobApplication';

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
    courses: IStudent['courses'],
    id: number
) => {
    const studentRepository = getRepository(Student);
    const departmentRepository = getRepository(Department);
    const courseRepository = getRepository(Course);
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

/**
 * @description saves a student's job application in the database.
 * @param studentId number
 * @param jobId number
 * @returns Promise
 */
export const applyJob = async (
    studentId: number,
    jobId: number
) => {
    const studentRepository = getRepository(Student);
    const jobRepository = getRepository(Job);
    const studentToJobRepository = getRepository(JobApplication);

    const student = await studentRepository.findOne(studentId);
    if (!student) throw new Error("Student does not exist.");

    // Check if job exists.
    const job = await jobRepository.findOne(jobId);
    if (job === undefined) throw new Error("Requested job does not exist.");

    // Check if student already applied for the job.
    const application = await studentToJobRepository.find({ job: job, student: student });
    if (application.length > 0) throw new Error("Student have already applied for the position.");
    
    // Create a new StudentToJob object.
    const jobApplication = studentToJobRepository.create({
        student: student,
        job: job,
        date: new Date()
    });
    return studentToJobRepository.save(jobApplication);
};
