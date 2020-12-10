import API from 'api';
import { IStudentProfileForm } from 'Domains/Student/StudentProfileForm';

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

export async function updateStudentProfile(
    studentProfile: IStudentProfileForm
) {
    return API.post('student/update-profile', {
        studentProfile: {
            ...studentProfile,
        },
    });
}
