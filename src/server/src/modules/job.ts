import { Job } from '@entities/job';
import { FacultyMember } from '@entities/facultyMember';
import { findDepartment } from '@modules/department';
import { getRepository, UpdateResult } from 'typeorm';

/**
 * @description Saves a new job. Assigns relationships with department and facultyMember tables
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
    const insertResult: { result: Job | undefined; message: string } = {
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

// TODO: Do filtering by start date. maybe?
export const getJobs = (
    title: string,
    types: string[],
    startDate: string,
    minSalary: number,
    hoursPerWeek: number,
    page: number,
    numOfItems: number
) => {
    let modType = 'none';
    if (types) {
        modType = types.join(',');
    }
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
        .where('LOWER(job.title) LIKE :title', {
            title: `%${title.toLowerCase()}%`,
        })
        .orWhere('job.type IN (:...types)', { types })
        .orWhere('job.type LIKE :type', { type: `%${modType}%` })
        .orWhere('job.minSalary >= :minSalary', { minSalary })
        .orWhere('job.hoursPerWeek >= :hoursPerWeek', { hoursPerWeek })
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
        status,
        minSalary,
        maxSalary,
        departmentId,
        id,
    } = job;

    const updateResult: {
        result: UpdateResult | undefined;
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
        status,
        minSalary,
        maxSalary,
        departmentId,
    });

    updateResult.result = updatedJob;
    updateResult.message = 'Job successfully updated';
    return updateResult;
};

/**
 * @description Deletes an existing job from the database
 * @param {number} id - Id of job to delete
 * @returns Promise
 */
export const deleteJob = (id: number) => {
    return getRepository(Job).delete(id);
};
