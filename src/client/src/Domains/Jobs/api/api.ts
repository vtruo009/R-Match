import API from '../../../api';

export type jobType = 'grader' | 'assistant' | 'researcher' | 'volunteer' | 'tutor' | 'other';

export interface IJob {
    id: number;
    targetYears: string[];
    hoursPerWeek: number;
    description: string;
    expirationDate?: string;
    startDate: string;
    endDate: string;
    type: jobType[];
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
