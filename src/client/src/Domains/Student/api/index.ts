import API from 'api';
import {
    ICourse,
    IDepartment,
    _IDepartment,
} from 'Components/AcademicInfo/api';
import { IStudentProfileForm } from 'Domains/Student/StudentProfileForm';
import { IWorkExperienceCreateFormValues } from 'Domains/Student/WorkExperienceCreateForm';
import { IUser } from 'Domains/Accounts/api';

export const classStandingValues = [
    {
        label: 'Freshman',
        value: 'Freshman',
    },
    {
        label: 'Sophomore',
        value: 'Sophomore',
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

export type classStandingTypes = 'Freshman' | 'Sophomore' | 'Junior' | 'Senior';

export interface IStudent {
    id: number;
    user: IUser;
    department?: IDepartment;
    sid?: string;
    gpa?: number;
    classStanding?: classStandingTypes;
    courses: ICourse[];
    resume?: Buffer;
    transcript?: Buffer;
}

export interface IStudentPreview {
    id: number;
    user: {
        firstName: string;
        lastName: string;
    };
    department?: _IDepartment;
    classStanding?: classStandingTypes;
}

export interface IWorkExperience {
    id: number;
    startDate: string;
    endDate?: string;
    title: string;
    employer: string;
    description: string;
}

export async function updateStudentProfile(
    studentProfile: IStudentProfileForm
) {
    const body = {
        studentProfile: {
            id: studentProfile.id,
            departmentId: studentProfile.departmentId,
            classStanding: studentProfile.classStanding,
            sid: studentProfile.sid,
            courses: studentProfile.courseIds?.map((courseId) => ({
                id: courseId,
            })),
            gpa: studentProfile.gpa
                ? parseFloat(studentProfile.gpa)
                : undefined,
            user: {
                id: studentProfile.userId,
                firstName: studentProfile.firstName,
                lastName: studentProfile.lastName,
                middleName: studentProfile.middleName,
                biography: studentProfile.biography,
            },
        },
    };
    return API.post('/student/update-profile', body);
}
export async function getStudentProfile(studentId: number) {
    return API.get<{ student: IStudent }>(`/student/get-profile/${studentId}`);
}

export async function getStudents(
    page: number,
    numOfItems: number,
    firstName?: string,
    lastName?: string,
    classStandings?: classStandingTypes[],
    departmentIds?: number[],
    email?: string,
    sid?: string
) {
    const params = {
        page,
        numOfItems,
        firstName,
        lastName,
        classStandings,
        departmentIds,
        email,
        sid,
    };

    return API.get<{
        studentPreviews: IStudentPreview[];
        studentsCount: number;
    }>('/student/search', { params });
}

export async function getWorkExperiences() {
    return API.get<{ workExperiences: IWorkExperience[] }>(
        '/student/get-work-experiences'
    );
}

export async function createWorkExperience(
    workExperience: IWorkExperienceCreateFormValues
) {
    console.log(workExperience);
    return API.post('/student/create-work-experience');
}

export async function updateWorkExperience(
    workExperience: IWorkExperienceCreateFormValues
) {
    console.log(workExperience);
    return API.post('/student/update-work-experience');
}

export async function deleteWorkExperience(workExperienceId: number) {
    return API.delete(`/student/delete-work-experience/${workExperienceId}`);
}
