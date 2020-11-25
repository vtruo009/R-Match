import { IJob, Job } from '@entities/job';
import { getRepository, MoreThanOrEqual } from 'typeorm';
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
        expirationDateAsDate.setFullYear(expirationDateAsDate.getFullYear() + 2);
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
        expirationDate:expirationDateAsDate,
        startDate: startDateAsDate,
        type: type,
        title: title,
        status: status,
        minSalary: minSalary,
        departmentId: departmentId,
        endDate: endDateAsDate,
        maxSalary: maxSalary
    });
    return repository.save(jobToInsert);
};

/**
 * @description gets all sample documents from the database
 * @returns Promise<Job[]>
 */

export const getJobs = (title: string, startDate: Date, minSalary: number, hoursPerWeek: number) => {
    return getRepository(Job).find({
        where: [
            { title: title },
            { startDate: MoreThanOrEqual(startDate) },
            { minSalary: MoreThanOrEqual(minSalary) },
            { hoursPerWeek: MoreThanOrEqual(hoursPerWeek) },
        ]
    });
};