import API from 'api';

import { IDepartment } from 'Components/AcademicInfo/api';
import { IJobCreateFormValues } from 'Domains/Jobs/JobCreateForm';
import { IJobUpdateFormValues } from 'Domains/Jobs/JobUpdateForm';
import { IStudentPreview, classStandingTypes } from 'Domains/Student/api';

export type jobType =
    | 'grader'
    | 'assistant'
    | 'researcher'
    | 'volunteer'
    | 'tutor'
    | 'other';

export type targetYearsType = 'Freshman' | 'Sophomore' | 'Junior' | 'Senior';

export type statusType = 'Hiring' | 'Closed';

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
    status: statusType;
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

export interface IJobApplication {
    id: number;
    date: string;
    job: IJob;
    jobId: number;
    studentId: number;

}

interface IJobApplicants {
    id: number;
    date: string;
    jobId: number;
    studentId: number;
    student: IStudentPreview;
    resumeId: number;
    transcriptId: number;
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
    return API.get<{ jobs: IJob[]; jobsCount: number }>('/job/read', {
        params,
    });
}

export async function createJob(job: IJobCreateFormValues) {
    return API.post('/job/create', {
        job: {
            title: job.title,
            description: job.description,
            startDate: job.startDate,
            endDate: job.endDate,
            expirationDate: job.expirationDate,
            type: job.type,
            hoursPerWeek: job.hoursPerWeek,
            targetYears: job.targetYears,
            minSalary: job.minSalary,
            maxSalary: job.maxSalary,
            departmentId: job.departmentId,
        },
    });
}

export async function updateJob(job: IJobUpdateFormValues) {
    return API.post('/job/update', {
        job: {
            id: job.id,
            title: job.title,
            description: job.description,
            startDate: job.startDate,
            endDate: job.endDate === '' ? undefined : job.endDate,
            expirationDate:
                job.expirationDate === '' ? undefined : job.expirationDate,
            type: job.type,
            hoursPerWeek: job.hoursPerWeek,
            targetYears: job.targetYears,
            minSalary: job.minSalary,
            maxSalary: job.maxSalary,
            departmentId: job.departmentId,
        },
    });
}

export async function deleteJob(jobId: number) {
    return API.delete(`/job/delete/${jobId}`);
}

export async function getPostedJobs(page: number, numOfItems: number) {
    const params = {
        page,
        numOfItems,
    };
    return API.get<{ jobs: IJob[]; jobsCount: number }>(
        '/faculty-member/get-posted-jobs',
        { params }
    );
}

export async function getAppliedJobs(page: number, numOfItems: number) {
    const params = {
        page,
        numOfItems,
    };
    return API.get<{
        jobApplications: IJobApplication[];
        jobApplicationsCount: number;
    }>('/student/get-applied-jobs', { params });
}

export async function closeJob(jobId: number) {
    return API.post(`/job/close/${jobId}`);
}

export async function openJob(jobId: number) {
    return API.post(`/job/open/${jobId}`);
}

export async function applyToJob(
    jobId: number,
    resumeId?: number,
    transcriptId?: number
) {
    return API.post<{ error: string }>(`/job/apply-to-job/${jobId}`, {
        resumeId,
        transcriptId,
    });
}

export async function getJobApplicants(
    jobId: number,
    page: number,
    numOfItems: number,
    classStandings?: classStandingTypes[],
    minimumGpa?: string,
    departmentIds?: number[],
    courseIds?: number[]
) {
    const params = {
        jobId,
        page,
        numOfItems,
        classStandings,
        minimumGpa,
        departmentIds,
        courseIds,
    };
    return API.get<{
        jobApplicants: IJobApplicants[];
        jobApplicantsCount: number;
    }>(`job/get-applicants`, { params });
}

export async function getRecommendedJobs() {
    return API.get<{ jobs: IJob[] }>('/job/get-recommended-jobs');
}

export async function getNewJobs() {
    const params = {
        page: 1,
        numOfItems: 10,
    };
    return API.get<{ jobs: IJob[] }>('/job/get-new-jobs', { params });
}

export async function getNumberOfApplicants(jobId: number) {
    return API.get<{ numberOfApplicants: number }>(
        `/job/get-number-of-applicants/${jobId}`
    );
}

export async function withdrawFromJob(jobId: number) {
    return API.delete<{ error: string }>(`/job/withdraw-from-job/${jobId}`);
}
