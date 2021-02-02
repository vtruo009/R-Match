import API from 'api';
import { IStudentProfileForm } from 'Domains/Student/StudentProfileForm';
import { IUser } from 'Domains/Accounts/api';
import {
    ICourse,
    IDepartment,
    _IDepartment,
} from 'Components/AcademicInfo/api';
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
    classStanding?: classStandingTypes;
    courses: ICourse[];
    resume?: Buffer;
    transcript?: Buffer;
    // workStartDate: string;
    // workEndDate?: string;
    // workTitle: string;
    // workEmployer: string;
    // workDescription: string;
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
/*export interface IWorkExperiences {
    workStartDate:string; 
    workEndDate?:string; 
    workTitle:string; 
    workEmployer:string; 
    workDescription: string;
}
*/

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
            user: {
                id: studentProfile.userId,
                firstName: studentProfile.firstName,
                lastName: studentProfile.lastName,
                middleName: studentProfile.middleName,
                biography: studentProfile.biography,
            },
            resume: studentProfile.resume,
            transcript: studentProfile.transcript,
            // workStartDate: studentProfile.workStartDate,
            // workEndDate: studentProfile.workEndDate,
            // workEmployer: studentProfile.workEmployer,
            // workDescription: studentProfile.workDescription,
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
    departmentId?: number,
    email?: string,
    sid?: string
) {
    const params = {
        page,
        numOfItems,
        firstName,
        lastName,
        classStandings,
        // TODO: FIX MAKE DEPARTMENT IDS BE ARRAY
        departmentIds: [],
        email,
        sid,
    };

    return API.get<{
        studentPreviews: IStudentPreview[];
        studentsCount: number;
    }>('/student/search', { params });
}
