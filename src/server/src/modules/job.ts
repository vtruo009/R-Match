import { IJob, Job } from '@entities/job';
import { getRepository } from 'typeorm';
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
    if (expirationDate == null) {
        // Set expiration date to 2 years after the current date.
        expirationDate = new Date();
        expirationDate.setFullYear(expirationDate.getFullYear() + 2);
    }
    if (maxSalary == null) {
        maxSalary = minSalary;
    }
    const repository = getRepository(Job);
    const jobToInsert = repository.create({
        targetYears,
        hoursPerWeek,
        description,
        expirationDate,
        startDate,
        type,
        title,
        status,
        minSalary,
        departmentId,
        endDate,
        maxSalary
    });
    return repository.save(jobToInsert);
};