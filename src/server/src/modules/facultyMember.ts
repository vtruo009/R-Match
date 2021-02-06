import { FacultyMember } from '@entities/facultyMember';
import { User } from '@entities/user';
import { Department } from '@entities/department';
import { Job } from '@entities/job';
import { Student } from '@entities/student';
import { getRepository } from 'typeorm';
import { JobApplication } from '../entities/jobApplication';

/**
 * @description Creates a faculty member using an existing user record from the database
 * @param {User} user - User object used to create the faculty member
 * @returns Promise
 */
export const createFacultyMember = (user: User) => {
    const facultyMemberToInsert = FacultyMember.create({
        userId: user.id,
    });
    return facultyMemberToInsert.save();
};

/**
 * @description Updates an existing faculty member profile in the database
 * @param {number} id - Id of faculty member to update
 * @param {User} user - User object to update
 * @param {number} departmentId - New id of the department that the faculty member belongs to
 * @param {string} websiteLink - New faculty member's website link
 * @param {string} office - New faculty member's office
 * @param {string} title - New faculty member's title
 * @returns Promise
 */
export const updateFacultyMember = async (
    id: FacultyMember['id'],
    user: FacultyMember['user'],
    departmentId: FacultyMember['departmentId'],
    websiteLink: FacultyMember['websiteLink'],
    office: FacultyMember['office'],
    title: FacultyMember['title']
) => {
    const facultyToUpdate = await FacultyMember.findOne(id);

    if (!facultyToUpdate) return undefined;

    if (departmentId) {
        const departmentObject = await Department.findOne(departmentId);
        if (departmentObject) {
            facultyToUpdate.departmentId = departmentId;
            await facultyToUpdate.save();
        }
    }

    await User.update(user.id, {
        biography: user.biography,
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
    });

    return FacultyMember.update(id, {
        websiteLink,
        office,
        title,
    });
};

/**
 * @description Gets the profile information of a faculty member
 * @param {number} id - Id of faculty member's profile to retrieve
 * @returns Promise
 */
export const getFacultyMemberProfile = (id: number) => {
    return getRepository(FacultyMember)
        .createQueryBuilder('facultyMember')
        .where({ id })
        .leftJoin('facultyMember.user', 'user')
        .addSelect([
            'user.id',
            'user.firstName',
            'user.lastName',
            'user.middleName',
            'user.biography',
            'user.email',
        ])
        .leftJoinAndSelect('facultyMember.department', 'department')
        .leftJoinAndSelect('department.college', 'college')
        .getOne();
};

/**
 * @description Get a list of jobs posted by a faculty member
 * @param {number} facultyMemberId - Id of faculty member
 * @returns Promise
 */
export const getPostedJobs = async (
    facultyMemberId: number,
    page: number,
    numOfItems: number
) => {
    
    // Check if a faculty member with the given id exists.
    const facultyMember = await FacultyMember.findOne(facultyMemberId);
    if (!facultyMember) return undefined;

    // Returns all jobs he posted.
    return getRepository(Job)
        .createQueryBuilder('job')
        .select([
            'job',
            'job.facultyMember',
            'facultyMember.id',
            'facultyMember.title',
            'user.firstName',
            'user.lastName',
        ])
        .leftJoin('job.facultyMember', 'facultyMember')
        .leftJoin('facultyMember.user', 'user')
        .where({ facultyMemberId: facultyMemberId })
        .leftJoinAndSelect('job.department', 'department')
        .leftJoinAndSelect('department.college', 'college')
        .skip((page - 1) * numOfItems)
        .take(numOfItems)
        .getManyAndCount();
};

/**
 * @description Get a list of students who applied to a job.
 * @param {number} facultyMemberId - Id of faculty member
 * @param {number} jobId - Id of the job
 * @param {number[]} departmentIds - List of department ids. [-1] if not specified.
 * @param {ClassStanding[]} classStandings - List of preferred class standings.
 * @param {number} minimumGpa - minimum GPA.
 * @returns Promise
 */
export const getApplicants = async (
    facultyMemberId: number,
    jobId: number,
    departmentIds: Student['departmentId'][],
    classStandings: Student['classStanding'][],
    minimumGpa: number,
) => {
    const getApplicantsResult: {
        result?: JobApplication[];
        message: string;
    } = {
        result: undefined,
        message: '',
    };

    // Check if a faculty member with the given id exists.
    const facultyMember = await FacultyMember.findOne(facultyMemberId);
    if (!facultyMember) {
        getApplicantsResult.message = 'The faculty member does not exist.';
        return getApplicantsResult;
    }

    // Check if a job with the given id exists.
    const job = await Job.findOne(jobId);
    if (!job) {
        getApplicantsResult.message = 'The requested job does not exist.';
        return getApplicantsResult;
    }

    // Check if the job is posted by the faculty member.
    if (job.facultyMemberId != facultyMemberId) {
        getApplicantsResult.message = 'The user does not have permission.';
        return getApplicantsResult;
    }

    // Returns all students applied to the position.
    const applications = await getRepository(JobApplication)
        .createQueryBuilder('jobApplication')
        .leftJoinAndSelect('jobApplication.student', 'student')
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
        .where({ jobId })
        .andWhere(
            '(NOT :departmentIdsPopulated OR department.id IN (:...departmentIds))',
            {
                departmentIdsPopulated: departmentIds[0] !== -1,
                departmentIds,
            }
        )
        .andWhere(
            '(student.classStanding IS NULL OR student.classStanding IN (:...classStandings))',
            {
                classStandings,
            }
        )
        .andWhere('(NOT :gpaIsPopulated OR student.gpa >= :minimumGpa)', {
            gpaIsPopulated: minimumGpa > 0,
            minimumGpa
        })
        .getMany();

    getApplicantsResult.message = 'Successfully obtained applicants.';
    getApplicantsResult.result = applications;

    return getApplicantsResult;
};
