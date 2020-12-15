import { IJob, Job } from '@entities/job';
import { FacultyMember } from '@entities/facultyMember';
import { getRepository, MoreThanOrEqual, In, Any } from 'typeorm';
/**
 * @description saves a new job in the database ans assigns a relationship of job-facultyMember. If faculty member does not exist it throws an error
 * @param targetYears string[]
 * @param hoursPerWeek number
 * @param description string
 * @param expirationDate Date
 * @param startDate Date
 * @param endDate Date
 * @param type string[]
 * @param title string
 * @param status 'Hiring' | 'Closed'
 * @param minSalary number
 * @param maxSalary number
 * @param departmentId string
 * @returns Promise
 */
export const createJob = async (
    targetYears: IJob['targetYears'],
    hoursPerWeek: IJob['hoursPerWeek'],
    description: IJob['description'],
    expirationDate: IJob['expirationDate'],
    startDate: IJob['startDate'],
    endDate: IJob['endDate'],
    type: IJob['type'],
    title: IJob['title'],
    status: IJob['status'],
    minSalary: IJob['minSalary'],
    maxSalary: IJob['maxSalary'],
    departmentId: IJob['departmentId'],
    facultyMemberId: number
) => {
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

    const jobRepository = getRepository(Job);
    const facultyMemberRepository = getRepository(FacultyMember);

    const facultyToUpdate = await facultyMemberRepository.findOne({
        where: { id: facultyMemberId },
        relations: ['jobs'],
    });

    if (!facultyToUpdate) {
        throw Error('Faculty member that posted the job does not exist');
    }

    const jobToInsert = jobRepository.create({
        targetYears: targetYears,
        hoursPerWeek: hoursPerWeek,
        description: description,
        expirationDate: expirationDateAsDate,
        startDate: startDateAsDate,
        type: type,
        title: title,
        status: status,
        minSalary: minSalary,
        departmentId: departmentId,
        endDate: endDateAsDate,
        maxSalary: maxSalary,
        postedOn: today,
    });
    // Save new job created
    await jobRepository.save(jobToInsert);
    // Add relationship between job and faculty member
    facultyToUpdate.jobs.push(jobToInsert);
    // save relationship
    return facultyMemberRepository.save(facultyToUpdate);
};

// /**
//  * @description gets all sample documents from the database
//  * @returns Promise<Job[]>
//  */
// export const getJobs = () => {
//     return getRepository(Job)
//         .createQueryBuilder('job')
//         .select([
//             'job',
//             'facultyMember.id',
//             'facultyMember.title',
//             'user.firstName',
//             'user.lastName',
//         ])
//         .leftJoin('job.facultyMember', 'facultyMember')
//         .leftJoin('facultyMember.user', 'user')
//         .getMany();

// TODO: Do filtering by start date. maybe?
export const getJobs = async (
    title: string,
    types: string[],
    startDate: string,
    minSalary: number,
    hoursPerWeek: number,
    page: number,
    numOfItems: number
) => {
    let modType = '';
    if (types) {
        modType = types.join(',');
    }
    return await getRepository(Job)
        .createQueryBuilder('job')
        .select([
            'job',
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
        // .orWhere('job.type IN (:...types)', { types })
        .orWhere('job.type LIKE :type', { type: `%${modType}%` })
        .orWhere('job.minSalary >= :minSalary', { minSalary })
        .orWhere('job.hoursPerWeek >= :hoursPerWeek', { hoursPerWeek })
        .skip((page - 1) * numOfItems)
        .take(numOfItems)
        .getManyAndCount();
};

/**
 * @description updates an existing job from the database
 * @param targetYears string[]
 * @param hoursPerWeek number
 * @param description string
 * @param expirationDate Date
 * @param startDate Date
 * @param endDate Date
 * @param type string[]
 * @param title string
 * @param status string
 * @param minSalary number
 * @param maxSalary number
 * @param departmentId string
 * @returns Promise
 */
export const updateJob = (
    targetYears: IJob['targetYears'],
    hoursPerWeek: IJob['hoursPerWeek'],
    description: IJob['description'],
    expirationDate: IJob['expirationDate'],
    startDate: IJob['startDate'],
    endDate: IJob['endDate'],
    type: IJob['type'],
    title: IJob['title'],
    status: IJob['status'],
    minSalary: IJob['minSalary'],
    maxSalary: IJob['maxSalary'],
    departmentId: IJob['departmentId'],
    id: number
) => {
    const startDateAsDate = new Date(startDate);
    let endDateAsDate;
    if (endDate) {
        endDateAsDate = new Date(endDate);
    }
    let expirationDateAsDate;
    if (expirationDate) {
        expirationDateAsDate = new Date(expirationDate);
    }

    return getRepository(Job).update(id, {
        targetYears: targetYears,
        hoursPerWeek: hoursPerWeek,
        description: description,
        expirationDate: expirationDateAsDate,
        startDate: startDateAsDate,
        endDate: endDateAsDate,
        type: type,
        title: title,
        status: status,
        minSalary: minSalary,
        maxSalary: maxSalary,
        departmentId: departmentId,
    });
};

/**
 * @description deletes an existing job from the database
 * @param id job's unique identifier
 * @returns Promise
 */
export const deleteJob = (id: number) => {
    return getRepository(Job).delete(id);
};
