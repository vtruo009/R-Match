import API from 'api';
import { IMessaging } from 'Domains/Messages/Messaging'; 

export const roles = [
    {
        label: 'Faculty member',
        value: 'facultyMember',
    },
    {
        label: 'Student',
        value: 'student',
    },
];

export interface IUser {
    id: number;
    email: string;
    biography?: string;
    firstName: string;
    lastName: string;
    middleName?: string;
    role: 'student' | 'facultyMember';
}

export async function signUp(signUpData: IMessaging) {
    return API.post<{ error: string }>('user/sign-up', {
        user: { ...signUpData },
    });
}
