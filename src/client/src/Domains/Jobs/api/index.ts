import API from 'api';
import { IJobCreateFormValues } from 'Domains/Jobs/JobCreateForm';
import { IJobUpdateFormValues } from 'Domains/Jobs/JobUpdateForm';
import { IDepartment } from 'Components/AcademicInfo/api';
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
        label: 'Assistant',
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
    department: IDepartment;
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
    types: string[],
    startDate: string,
    minSalary: string,
    hoursPerWeek: string,
    page: number,
    numOfItems: number
) {
    const params = {
        title,
        types,
        startDate,
        minSalary,
        hoursPerWeek,
        page,
        numOfItems,
    };
    return API.get<{ jobs: IJob[]; jobsCount: number }>('job/read', { params });
}

export async function createJob(job: IJobCreateFormValues) {
    // TODO: Fix
    delete job.collegeId;
    return API.post('job/create', {
        job,
    });
}

// TODO: Make sure job gets an id and an status
export async function updateJob(job: IJobUpdateFormValues) {
    // delete job.collegeId;
    return API.post('job/update', {
        job,
    });
}

export async function deleteJob(jobId: number) {
    return API.delete(`job/delete/${jobId}`);
}

export async function getPostedJobs() {
    return API.get<{ jobs: IJob[] }>('faculty-member/get-posted-jobs');
}
