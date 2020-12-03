import API from 'api';
import { ISignInForm } from 'Domains/Accounts/SignInForm';
import { ISignUpForm } from 'Domains/Accounts/SignUpForm';
import { IUser } from 'Contexts/AuthContext/api';

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

export async function signUp(signUpData: ISignUpForm) {
    return API.post<{ error: string }>('user/sign-up', {
        user: { ...signUpData },
    });
}

export async function signIn(signInData: ISignInForm) {
    return API.post<{ user: IUser; isAuthenticated: boolean }>('user/sign-in', {
        ...signInData,
    });
}

export async function signOut() {
    return API.get('user/sign-out');
}
