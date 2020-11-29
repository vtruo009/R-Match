import API from 'api';
import { IFacultyMemberProfileForm } from 'Domains/FacultyMember/FacultyMemberProfileForm'

//TODO: DEFINE THIS LATER!
export async function createFacultyMemberProfile(facultyMemberProfile: IFacultyMemberProfileForm) {
    return API.post('facultyMemberProfile/create', {
        facultyMemberProfile: {
            ...facultyMemberProfile,
        }
    });
}