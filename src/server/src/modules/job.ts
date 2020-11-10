import { IJob, Job } from '@entities/job';
import { getRepository } from 'typeorm';
/**
 * @description saves a new job in the database
 * @param targetYears job message
 * @param hoursPerWeek job number
 * @param description job number
 * @param startDate job number
 * @param endDate job number
 * @param type job number
 * @param title job number
 * @param status job number
 * @param minSalary job number
 * @param maxSalary job number
 * @returns Promise
 */
export const createJob = (
    targetYears: IJob['targetYears'],
    hoursPerWeek: IJob['hoursPerWeek'],
    description: IJob['description'],
    startDate: IJob['startDate'],
    endDate: IJob['endDate'],
    type: IJob['type'],
    title: IJob['title'],
    status: IJob['status'],
    minSalary: IJob['minSalary'],
    maxSalary: IJob['maxSalary']
) => {
    const repository = getRepository(Job);
    const jobToInsert = repository.create({
        targetYears,
        hoursPerWeek,
        description,
        startDate,
        endDate,
        type,
        title,
        status,
        minSalary,
        maxSalary
    });
    return repository.save(jobToInsert);
};