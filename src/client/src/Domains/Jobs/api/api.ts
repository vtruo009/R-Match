import API from '../../../api';

export interface IJob {
    jobId: number;
    targetYears: string[];
    hoursPerWeek: number;
    description: string;
    startDate: string;
    endDate: string;
    type: string;
    title: string;
    status: string;
    minSalary: number;
    maxSalary?: number;
}

export async function getJobs() {
    return API.get<{ jobs: IJob[] }>('job/read');
}
