import API from 'api';
import { ISignInForm } from 'Domains/Accounts/SignInForm';
import { ISignUpForm } from 'Domains/Accounts/SignUpForm';

export const roles = [
    {
        label: 'Faculty member',
        value: 'Faculty member',
    },
    {
        label: 'Student',
        value: 'Student',
    }
];

export interface ISignInInfo {
    email: string;
    password: string;
}

export interface ISignUpInfo {
    email: string;
    password: string;
}

export async function signUp(signUp: ISignUpForm) {
    alert("Signed up with\nemail:" + signUp.email + "\npassword:" + signUp.password);
    // TODO: Change API below.
    return API.post('job/create', {});
}


export async function signIn(signIn: ISignInForm) {
    alert("Logged in with\nemail:" + signIn.email + "\npassword:" + signIn.password);
    // TODO: Change API below.
    return API.post('job/create', { });
}
