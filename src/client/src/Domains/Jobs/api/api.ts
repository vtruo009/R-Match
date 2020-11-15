import API from '../../../api';

export interface IJob {
    jobId: number;
    targetYears: string[];
    hoursPerWeek: number;
    description: string;
    expirationDate?: string;
    startDate: string;
    endDate: string;
    type: string;
    title: string;
    status: 'Hiring' | 'Closed';
    minSalary: number;
    maxSalary?: number;
    // TODO: In the future this attribute should be called departmentName
    departmentId: string;
}

export async function getJobs() {
    return API.get('job/read');
}
