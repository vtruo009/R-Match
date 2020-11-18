import API from '../../../api';
import { validateDateString } from '../../../utils/helpers';

export type jobType =
    | 'grader'
    | 'assistant'
    | 'researcher'
    | 'volunteer'
    | 'tutor'
    | 'other';

export type targetYearsType = 'Freshman' | 'Sophmore' | 'Junior' | 'Senior';

export const departments = [
    {
        label: 'Biochemistry',
        value: 'Biochemistry',
    },
    {
        label: 'Bioengineering',
        value: 'Bioengineering',
    },
    {
        label: 'Chemical Engineering',
        value: 'Chemical Engineering',
    },
    {
        label: 'Computer Science',
        value: 'Computer Science',
    },
    {
        label: 'Computer Engineering',
        value: 'Computer Engineering',
    },
    {
        label: 'Data Science',
        value: 'Data Science',
    },
    {
        label: 'Environmental Engineering',
        value: 'Environmental Engineering',
    },
    {
        label: 'Electrical Engineering',
        value: 'Electrical Engineering',
    },
    {
        label: 'Materials Science and Engineering',
        value: 'Materials Science and Engineering',
    },
    {
        label: 'Mechanical Engineering',
        value: 'Mechanical Engineering',
    },
];

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
    type: jobType[];
    title: string;
    status: 'Hiring' | 'Closed';
    minSalary: number;
    maxSalary?: number;
    departmentId: string;
}

export interface IJobForm {
    targetYears: string[];
    hoursPerWeek: string;
    description: string;
    expirationDate: string;
    startDate: string;
    endDate: string;
    type: jobType[];
    title: string;
    minSalary: string;
    maxSalary: string;
    departmentId: string;
}

export async function getJobs() {
    return API.get('job/read');
}

export async function createJob(job: IJobForm) {
    return API.post('job/create', {
        job: {
            ...job,
            status: 'Hiring',
            startDate: job.startDate,
            endDate: validateDateString(job.endDate),
            expirationDate: validateDateString(job.expirationDate),
            hoursPerWeek: parseInt(job.hoursPerWeek, 10),
            minSalary: parseInt(job.minSalary, 10),
            maxSalary: parseInt(job.maxSalary, 10),
        },
    });
}
