import API from 'api';
import { IJobForm } from 'Domains/Accounts/JobForm';
import Axios from 'axios';

export interface IJob {
    email: string;
    password: string;
}

export async function signIn(job: IJobForm) {
    alert("Logged in with\nemail:" + job.email + "\npassword:" + job.password);
    // TODO: Change API below.
    return API.post('job/create', { });
}
