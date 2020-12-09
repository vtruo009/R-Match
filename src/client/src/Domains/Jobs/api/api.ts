import API from 'api';
import { IJobForm } from 'Domains/Jobs/JobForm';

export type jobType =
    | 'grader'
    | 'assistant'
    | 'researcher'
    | 'volunteer'
    | 'tutor'
    | 'other';

export type targetYearsType = 'Freshman' | 'Sophmore' | 'Junior' | 'Senior';

export const jobTypes = [
    {
        label: 'Grader',
        value: 'grader',
    },
    {
        label: 'Assitant',
        value: 'assistant',
    },
    {
        label: 'Researcher',
        value: 'researcher',
    },
    {
        label: 'Volunteer',
        value: 'volunteer',
    },
    {
        label: 'Tutor',
        value: 'tutor',
    },
    {
        label: 'Other',
        value: 'other',
    },
];

export const targetYears = [
    {
        label: 'Freshman',
        value: 'Freshman',
    },
    {
        label: 'Sophmore',
        value: 'Sophmore',
    },
    {
        label: 'Junior',
        value: 'Junior',
    },
    {
        label: 'Senior',
        value: 'Senior',
    },
];

export interface IJob {
    id: number;
    targetYears: targetYearsType[];
    hoursPerWeek: number;
    description: string;
    expirationDate?: string;
    startDate: string;
    endDate?: string;
    postedOn: string;
    type: jobType[];
    title: string;
    status: 'Hiring' | 'Closed';
    minSalary: number;
    maxSalary?: number;
    departmentId: string;
    facultyMember: {
        id: number;
        title?: string;
        user: {
            firstName: string;
            lastName: string;
        };
    };
}

export async function getJobs(
    title: string,
    minSalary: string,
    minHoursPerWeek: string
) {
    const params = {
        title,
        minSalary,
        minHoursPerWeek,
    };

    return API.get<{ jobs: IJob[] }>('job/read', { params });
}

export async function createJob(job: IJobForm) {
    return API.post('job/create', {
        job: {
            ...job,
            status: 'Hiring',
        },
    });
}
