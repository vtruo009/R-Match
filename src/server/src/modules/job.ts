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
    hoursPerWeek: IJob['hoursPerWeek']
) => {
    const repository = getRepository(Job);
    const jobToInsert = repository.create({
        hoursPerWeek,
    });
    return repository.save(jobToInsert);
};