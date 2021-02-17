import API from 'api';
import { IDepartment, ICourse } from 'Components/AcademicInfo/api';
import { IFacultyMemberProfileForm } from 'Domains/FacultyMember/FacultyMemberProfileForm';
import { IUser } from 'Domains/Accounts/api';

export interface IFacultyMember {
    id: number;
    user: IUser;
    department?: IDepartment;
    courses: ICourse[];
    websiteLink?: string;
    office?: string;
    title?: string;
}

export async function getFacultyMemberProfile(facultyMemberId: number) {
    return API.get<{ facultyMember: IFacultyMember }>(
        `/faculty-member/get-profile/${facultyMemberId}`
    );
}

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
