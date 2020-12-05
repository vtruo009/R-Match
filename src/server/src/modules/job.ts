import { IJob, Job } from '@entities/job';
import { getRepository, MoreThanOrEqual, In, Any } from 'typeorm';
/**
 * @description saves a new job in the database
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
export const createJob = (
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
    departmentId: IJob['departmentId']
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

    const repository = getRepository(Job);
    const jobToInsert = repository.create({
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
    });
    return repository.save(jobToInsert);
};

/**
 * @description gets all sample documents from the database
 * @returns Promise<Job[]>
 */

export const getJobs = async (
    title: string,
    types: string[],
    startDate: string,
    minSalary: number,
    hoursPerWeek: number,
    page: number,
    numOfItems: number,
) => {

    console.log(`numOfItems in jobs.ts/modules is ${numOfItems}`); //this logs NaN
    return await getRepository(Job)
        .createQueryBuilder('job')
        // Accomplishes substring matching using PostgreSQL pattern matching. 
        // Note: Any job title matches the pattern of a empty title. 
        // I think we should obligate the user to enter a job title
        .where('LOWER(job.title) LIKE :title', {
            title: `%${title.toLowerCase()}%`,
        })
        .orWhere('job.type IN (:...types)', { types })
        // For some reason startDate filtering is not quite working
        // .orWhere('job.startDate >= :startDate ', {
        //     startDate,
        // })
        .orWhere('job.minSalary >= :minSalary', { minSalary })
        .orWhere('job.hoursPerWeek >= :hoursPerWeek', { hoursPerWeek })
        // .limit(numOfItems)
        // .offset((page - 1) * numOfItems)
        .skip((page - 1) * numOfItems)
        .take(numOfItems)
        // .getManyAndCount(); returns [array, number] but couldn't access the number
        //.getCount();
        .getMany();
    // return getRepository(Job).find({
    //     where: [
    //         { title: title },
    //         { type: In(types) },
    //         { startDate: MoreThanOrEqual(startDate) },
    //         { minSalary: MoreThanOrEqual(minSalary) },
    //         { hoursPerWeek: MoreThanOrEqual(hoursPerWeek) },
    //     ],
    // });
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
    // return job.findByIdAndDelete(_id);
    return getRepository(Job).delete(id);
};
