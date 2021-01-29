import API from 'api';
import { IFacultyMemberProfileForm } from 'Domains/FacultyMember/FacultyMemberProfileForm'
import { IDepartment, ICourse } from 'Components/AcademicInfo/api';
import { IStudent } from 'Domains/Student/api';
import { IUser } from 'Domains/Accounts/api';

interface IJobApplication {
    id: number,
    date: string,
    jobId: number,
    studentId: number,
    student: IStudent,
}

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

export async function getStudentsApplied(
    jobId: number,
    page: number,
    numOfItems: number
) {
    const params = {
        page,
        numOfItems,
    };
    //return API.get<{ /* students: IStudentsApplied[] -> name of array: TYPE[] */}>('/get-applicants/1') // to add job id; when put # can just put 1
    return API.get<{ jobApplications: IJobApplication[], jobApplicationsCount: number }>(`faculty-member/get-job-applications/${jobId}`, { params });
}

export default IJobApplication;
//here can declare interface for students appliead; has to match whatever mari gives back -> export then import it in Studentlist compo
