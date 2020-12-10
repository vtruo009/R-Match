import API from 'api';
import { IStudentProfileForm } from 'Domains/Student/StudentProfileForm';
import { IUser } from 'Domains/Accounts/api/api';

export const classStandingTypes = [
    {
        label: 'Freshman',
        value: 'freshman',
    },
    {
        label: 'Sophomore',
        value: 'sophomore',
    },
    {
        label: 'Junior',
        value: 'junior',
    },
    {
        label: 'Senior',
        value: 'senior',
    },
];

// TODO: Move these interfaces to their respective in the future
interface ICollege {
    id: number;
    name: string;
}
interface IDepartment {
    id: number;
    name: string;
    college: ICollege;
}

interface ICourse {
    id: number;
    title: string;
}

export interface IStudent {
    id: number;
    user: IUser;
    department?: IDepartment;
    sid?: number;
    classStanding?: string;
    courses?: ICourse[];
    resume?: File;
    transcript?: File;
}

export async function updateStudentProfile(
    studentProfile: IStudentProfileForm
) {
    return API.post('student/update-profile', {
        studentProfile: {
            ...studentProfile,
        },
    });
}

// No parameters needed since user will have to be authenticated
export async function getStudentProfile() {
    return API.get<{ student: IStudent }>('student/get-profile');
}
