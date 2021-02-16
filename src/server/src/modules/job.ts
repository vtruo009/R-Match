import { Job } from '@entities/job';
import { FacultyMember } from '@entities/facultyMember';
import { findDepartment } from '@modules/department';
import { getRepository, UpdateResult } from 'typeorm';
import { JobApplication } from '@entities/jobApplication';
import { Student } from '@entities/student';

/**
 * @description Finds a job by id
 * @param {number} id - Id of job to find
 * @returns Promise
 */
export const findJob = (id: Job['id']) => {
    return Job.findOne(id);
};

/**
 * @description Saves a new job. Assigns relationships with department and facultyMember tables
 * @param {number} studentId - Student id of the logged in student
 * @param {string[]} targetYears - School years targeted by the job
 * @param {number} hoursPerWeek - Number of hours per week required by the job
 * @param {string} description - Description of the job
 * @param {Date} expirationDate - Expiration date of the job
 * @param {Date} startDate - Start date of the job
 * @param {Date} endDate - End date of the job
 * @param {string[]} type - Types of the job
 * @param {string} title - Title of the job
 * @param {number} minSalary - Minimum salary of the job
 * @param {number} maxSalary - Maximum salary of the job
 * @param {number} departmentId - Id of the department that the job belongs to
 * @param {number} facultyMemberId - Id of the faculty member that posts the job
 * @returns Promise
 */
export const createJob = async (
    targetYears: Job['targetYears'],
    hoursPerWeek: Job['hoursPerWeek'],
    description: Job['description'],
    expirationDate: Job['expirationDate'],
    startDate: Job['startDate'],
    endDate: Job['endDate'],
    type: Job['type'],
    title: Job['title'],
    minSalary: Job['minSalary'],
    maxSalary: Job['maxSalary'],
    departmentId: Job['departmentId'],
    facultyMemberId: Job['facultyMemberId']
) => {
    const insertResult: { result?: Job; message: string } = {
        result: undefined,
        message: '',
    };

    const startDateAsDate = new Date(startDate);
    let expirationDateAsDate: Date;
    if (expirationDate) {
        expirationDateAsDate = new Date(expirationDate);
    } else {
        // Set expiration date to 2 years after the current date.
        expirationDateAsDate = new Date();
        expirationDateAsDate.setFullYear(
            expirationDateAsDate.getFullYear() + 2
        );
    }

    let endDateAsDate;
    if (endDate) {
        endDateAsDate = new Date(endDate);
    }

    if (!maxSalary) {
        maxSalary = minSalary;
    }

    const today = new Date();
    const facultyMemberRepository = getRepository(FacultyMember);

    const facultyToUpdate = await facultyMemberRepository.findOne({
        where: { id: facultyMemberId },
    });
    if (!facultyToUpdate) {
        insertResult.message =
            'Faculty member that posted the job does not exist';
        return insertResult;
    }

    const departmentToUpdate = await findDepartment(departmentId);
    if (!departmentToUpdate) {
        insertResult.message =
            'Department id provided does not belong to any department';
        return insertResult;
    }

    const jobToInsert = await Job.create({
        targetYears,
        hoursPerWeek,
        description,
        expirationDate: expirationDateAsDate,
        startDate: startDateAsDate,
        type,
        title,
        status: 'Hiring',
        minSalary,
        endDate: endDateAsDate,
        maxSalary,
        postedOn: today,
        departmentId,
        facultyMemberId,
    }).save();

    insertResult.result = jobToInsert;
    insertResult.message = 'Job successfully inserted';
    return insertResult;
};

const getDateString = (dateObject: Date) => {
    const month = dateObject.getMonth() + 1;
    const date = dateObject.getDate();
    const year = dateObject.getFullYear();
    return month + '/' + date + '/' + year;
}

export const getJobs = async (
    studentId: number,
    title: string,
    types: string[],
    startDate: string,
    minSalary: number,
    hoursPerWeek: number,
    page: number,
    numOfItems: number
) => {
    let modType = 'none';
    const modStart = getDateString(new Date(startDate));
    const todayString = getDateString(new Date());
    if (types) {
        modType = types.join(',');
    }

    const jobApplications = await JobApplication.find({ where: { studentId } });
    const appliedJobIds = jobApplications.map(
        (jobApplication) => jobApplication.jobId
    );

    const matchingJobs = await getRepository(Job)
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
        .leftJoinAndSelect('job.department', 'department')
        .where('LOWER(job.title) LIKE :title', { title: `%${title.toLowerCase()}%` })
        .andWhere('(job.type IN (:...types) OR job.type LIKE :type)', {
            types,
            type: `%${modType}%`,
        })
        .andWhere('job.startDate >= :startDate', { startDate: modStart })
        .andWhere('job.minSalary >= :minSalary', { minSalary })
        .andWhere('job.hoursPerWeek >= :hoursPerWeek', {hoursPerWeek})
        .andWhere('job.status = :jobStatus', {
            jobStatus: 'Hiring',
        })
        .andWhere('job.id NOT IN (:...appliedJobIds)', {
            // It causes a SQL parse error when an empty array is passed in.
            appliedJobIds: appliedJobIds.length > 0 ? appliedJobIds : [-1],
        })
        .andWhere('job.expirationDate >= :today', { today: todayString })
        .skip((page - 1) * numOfItems)
        .take(numOfItems)
        .getManyAndCount();

    const jobsCount = matchingJobs[1];

    if (jobsCount > 0) {
        return matchingJobs
    }

    // If no jobs found, we  use "OR" queries to suggest jobs
    // that partially match with the query.
    return await getRepository(Job)
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
        .leftJoinAndSelect('job.department', 'department')
        .where(
            `(LOWER(job.title) LIKE :title
                    OR job.type IN (:...types)
                    OR job.type LIKE :type
                    OR job.startDate >= :startDate
                    OR job.minSalary >= :minSalary
                    OR job.hoursPerWeek >= :hoursPerWeek)`,
            {
                title: `%${title.toLowerCase()}%`,
                types,
                type: `%${modType}%`,
                startDate: modStart,
                minSalary,
                hoursPerWeek,
            }
        )
        .andWhere('job.status = :jobStatus', {
            jobStatus: 'Hiring',
        })
        .andWhere('job.id NOT IN (:...appliedJobIds)', {
            // It causes a SQL parse error when an empty array is passed in.
            appliedJobIds: appliedJobIds.length > 0 ? appliedJobIds : [-1],
        })
        .andWhere('job.expirationDate >= :today', { today: todayString })
        .skip((page - 1) * numOfItems)
        .take(numOfItems)
        .getManyAndCount();
};

/**
 * @description Updates the properties of an already existing job.
 * @param {Job} job - Job object storing the fields to update
 * @param {string[]} job.targetYears - New target school years of the job
 * @param {number} job.hoursPerWeek - New number of hours per week required by the job
 * @param {string} job.description - New description of the job
 * @param {Date} job.expirationDate - Expiration date of the job
 * @param {Date} job.startDate - New start date of the job
 * @param {Date} job.endDate - New dnd date of the job
 * @param {string[]} job.type - New types of the job
 * @param {string} job.title - New title of the job
 * @param {number} job.minSalary - New minimum salary of the job
 * @param {number} job.maxSalary - New maximum salary of the job
 * @param {number} job.departmentId - New id of the department that the job belongs to
 * @param {number} job.id - Id of the job to update
 * @returns Promise
 */
export const updateJob = async (job: Job) => {
    const {
        targetYears,
        hoursPerWeek,
        description,
        expirationDate,
        startDate,
        endDate,
        type,
        title,
        minSalary,
        maxSalary,
        departmentId,
        id,
    } = job;

    const updateResult: {
        result?: UpdateResult;
        message: string;
    } = {
        result: undefined,
        message: '',
    };

    const startDateAsDate = new Date(startDate);
    let endDateAsDate;
    if (endDate) {
        endDateAsDate = new Date(endDate);
    }
    let expirationDateAsDate;
    if (expirationDate) {
        expirationDateAsDate = new Date(expirationDate);
    }

    const departmentToUpdate = await findDepartment(departmentId);
    if (!departmentToUpdate) {
        updateResult.message =
            'Department id provided does not belong to any department';
        return updateResult;
    }

    const updatedJob = await Job.update(id, {
        targetYears,
        hoursPerWeek,
        description,
        expirationDate: expirationDateAsDate,
        startDate: startDateAsDate,
        endDate: endDateAsDate,
        type,
        title,
        minSalary,
        maxSalary,
        departmentId,
    });
    updateResult.result = updatedJob;
    updateResult.message = 'Job successfully updated';
    return updateResult;
};

/**
 * @description Deletes an existing job and relevant job applications from the database
 * @param {number} id - Id of job to delete
 * @returns Promise
 */
export const deleteJob = async (id: Job['id']) => {
    await JobApplication.delete({ jobId: id });
    return Job.delete(id);
};

/**
 * @description Closes an existing job from the database
 * @param {number} id - Id of job to close
 * @param {number} facultyMemberId - Id of faculty member that requested to close the job
 * @returns Promise
 */
export const closeJob = async (
    id: Job['id'],
    facultyMemberId: Job['facultyMemberId']
) => {
    const closeJobResult: {
        result?: UpdateResult;
        message: string;
    } = {
        result: undefined,
        message: '',
    };

    const jobToClose = await findJob(id);

    if (!jobToClose) {
        closeJobResult.message = 'Job does not exist';
        return closeJobResult;
    }

    if (jobToClose.facultyMemberId !== facultyMemberId) {
        closeJobResult.message = 'Faculty member is not owner of the job';
        return closeJobResult;
    }

    const closedJob = await Job.update(id, { status: 'Closed' });
    closeJobResult.result = closedJob;
    closeJobResult.message = 'Job successfully closed';
    return closeJobResult;
};

/**
 * @description Activates an existing job from the database
 * @param {number} id - Id of job to activate
 * @param {number} facultyMemberId - Id of faculty member that requested to activate the job
 * @returns Promise
 */
export const openJob = async (
    id: Job['id'],
    facultyMemberId: Job['facultyMemberId']
) => {
    const activateJobResult: {
        result?: UpdateResult;
        message: string;
    } = {
        result: undefined,
        message: '',
    };

    const jobToActivate = await findJob(id);

    if (!jobToActivate) {
        activateJobResult.message = 'Job does not exist';
        return activateJobResult;
    }

    if (jobToActivate.facultyMemberId !== facultyMemberId) {
        activateJobResult.message = 'Faculty member is not owner of the job';
        return activateJobResult;
    }

    const activatedJob = await Job.update(id, { status: 'Hiring' });
    activateJobResult.result = activatedJob;
    activateJobResult.message = 'Job successfully activated';
    return activateJobResult;
};

/**
 * @description Saves a student's job application in the database.
 * @param {number} studentId - Id of student that submits the application
 * @param {number} jobId - Id of job that students apply to
 * @returns Promise
 */
export const applyToJob = async (studentId: number, jobId: number) => {
    const applicationResult: {
        result?: JobApplication;
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
        applicationResult.message = 'You have already applied for the position';
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
    page: number,
    numOfItems: number
) => {
    const getApplicantsResult: {
        result?: JobApplication[];
        message: string;
        count: number;
    } = {
        result: undefined,
        message: '',
        count: 0,
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
    const applicants = await getRepository(JobApplication)
        .createQueryBuilder('jobApplication')
        .leftJoin('jobApplication.student', 'student')
        .addSelect(['student.id', 'student.classStanding'])
        .leftJoin('student.user', 'user')
        .addSelect(['user.firstName', 'user.lastName'])
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
            minimumGpa,
        })
        .skip((page - 1) * numOfItems)
        .take(numOfItems)
        .getManyAndCount();

    getApplicantsResult.message = 'Successfully obtained applicants.';
    getApplicantsResult.result = applicants[0];
    getApplicantsResult.count = applicants[1];

    return getApplicantsResult;
};

/**
 * @description Returns total count of job applications of a given job
 * @param {number} jobId - id of job
 * @returns Promise
 */
export const getNumberApplicants = (jobId: Job['id']) => {
    return JobApplication.count({ where: { jobId } });
};

/**
 * @description Returns at most 20 newest jobs that match with student's department
 *              and class standing.
 * @param {number} studentId - id of student
 * @returns Promise
 */
export const getRecommendedJobs = async (studentId: number) => {
    const student = await Student.findOneOrFail({ where: { id: studentId } });

    const jobApplications = await JobApplication.find({ where: { studentId } });
    const appliedJobIds = jobApplications.map(
        (jobApplication) => jobApplication.jobId
    );

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
        .leftJoinAndSelect('job.department', 'department')
        .where('job.status = :jobStatus', {
            jobStatus: 'Hiring',
        })
        .andWhere('job.id NOT IN (:...appliedJobIds)', {
            // It causes a SQL parse error when an empty array is passed in.
            appliedJobIds: appliedJobIds.length > 0 ? appliedJobIds : [-1],
        })
        .andWhere('(:departmentId < 0 OR job.departmentId = :departmentId)', {
            departmentId: student.departmentId ?? -1,
        })
        .andWhere(
            `(:classStanding = :null OR
                    :classStanding = ANY(string_to_array(job.targetYears, :comma)))`,
            {
                classStanding: student.classStanding ?? 'NULL',
                null: 'NULL',
                comma: ',',
            }
        )
        .take(20)
        .orderBy('job.postedOn', 'DESC')
        .getMany();
};

/**
 * @description Returns new jobs, excluding closed jobs and the jobs that are already applied
 *              by the student.
 * @param {number} studentId - id of student
 * @param {number} page - page index
 * @param {number} numOfItems - number of items per page
 * @returns Promise
 */
export const getNewJobs = async (
    studentId: number,
    page: number,
    numOfItems: number
) => {
    const jobApplications = await JobApplication.find({ where: { studentId } });
    const appliedJobIds = jobApplications.map(
        (jobApplication) => jobApplication.jobId
    );

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
        .leftJoinAndSelect('job.department', 'department')
        .where('job.status = :jobStatus', {
            jobStatus: 'Hiring',
        })
        .andWhere('job.id NOT IN (:...appliedJobIds)', {
            // It causes a SQL parse error when an empty array is passed in.
            appliedJobIds: appliedJobIds.length > 0 ? appliedJobIds : [-1],
        })
        .orderBy('job.postedOn', 'DESC')
        .skip((page - 1) * numOfItems)
        .take(numOfItems)
        .getManyAndCount();
};
