import API from 'api';
import { IFacultyMemberProfileForm } from 'Domains/FacultyMember/FacultyMemberProfileForm';

export async function updateFacultyMemberProfile(
    facultyMemberProfile: IFacultyMemberProfileForm
) {
    const {
        id,
        userId,
        firstName,
        lastName,
        middleName,
        biography,
        office,
        title,
        websiteLink,
        departmentId,
    } = facultyMemberProfile;

    return API.post('/faculty-member/update-profile', {
        facultyMemberProfile: {
            id,
            user: {
                id: userId,
                firstName,
                lastName,
                middleName,
                biography,
            },
            departmentId,
            office,
            title,
            websiteLink,
        },
    });
}
