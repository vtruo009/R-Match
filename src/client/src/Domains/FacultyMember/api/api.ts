import API from 'api';


export interface IFacultyMemberProfileForm {
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
export async function createFacultyMemberProfile(facultyMemberProfile: IFacultyMemberProfileForm) {
    return API.post('facultyMemberProfile/create', {
        facultyMemberProfile: {
            ...facultyMemberProfile,
        }
    });
}