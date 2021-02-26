import API from 'api';
import { ISignInForm } from 'Domains/Accounts/SignInForm';
import { ISignUpForm } from 'Domains/Accounts/SignUpForm';
import { IAuthUser } from 'Contexts/AuthContext/api';

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

export async function signUp(signUpData: ISignUpForm) {
    return API.post<{ error: string }>('/user/sign-up', {
        user: { ...signUpData },
    });
}

export async function signIn(signInData: ISignInForm) {
    return API.post<{ user: IAuthUser; isAuthenticated: boolean, error: string }>(
        '/user/sign-in',
        {
            ...signInData,
        }
    );
}

export async function signOut() {
    return API.get<{ user: IAuthUser }>('/user/sign-out');
}

export async function verify(verificationKey: string) {
    return API.post<{ error: string }>('/user/verify', { verificationKey });
}
