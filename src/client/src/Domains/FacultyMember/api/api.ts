import API from 'api';

export const departments = [
    {
        label: 'Biochemistry',
        value: 'Biochemistry',
    },
    {
        label: 'Bioengineering',
        value: 'Bioengineering',
    },
    {
        label: 'Chemical Engineering',
        value: 'Chemical Engineering',
    },
    {
        label: 'Computer Science',
        value: 'Computer Science',
    },
    {
        label: 'Computer Engineering',
        value: 'Computer Engineering',
    },
    {
        label: 'Data Science',
        value: 'Data Science',
    },
    {
        label: 'Environmental Engineering',
        value: 'Environmental Engineering',
    },
    {
        label: 'Electrical Engineering',
        value: 'Electrical Engineering',
    },
    {
        label: 'Materials Science and Engineering',
        value: 'Materials Science and Engineering',
    },
    {
        label: 'Mechanical Engineering',
        value: 'Mechanical Engineering',
    },
];

export interface IFacultyMemberProfile {
    firstName: string; 
    middleName: string; 
    lastName: string; 
    departmentId: string;
    websiteLink: string; 
    office: string; 
    title: string; 
    email: string; 
    biography: string;
}

//TODO: DEFINE THIS LATER!
export async function createFacultyMemberProfile(facultyMemberProfile: IFacultyMemberProfile) {
    return API.post('facultyMemberProfile/create', {
        facultyMemberProfile: {
            ...facultyMemberProfile,
        }
    });
}