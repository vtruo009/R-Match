import API from 'api';
import { IStudentProfileForm } from 'Domains/Student/StudentProfileForm'

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

//TODO: DEFINE THIS LATER!
export async function createStudentProfile(studentProfile: IStudentProfileForm) {
    return API.post('studentProfile/create', {
        studentProfile: {
            ...studentProfile,
        }
    });
}