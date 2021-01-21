import API from 'api';
import { IFacultyMemberProfileForm } from 'Domains/FacultyMember/FacultyMemberProfileForm'
import { IDepartment, ICourse } from 'Components/AcademicInfo/api';
import { IStudent } from 'Domains/Student/api';

interface IJobApplication {
    id: number,
    date: string,
    jobId: number,
    studentId: number,
    student: IStudent,
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

    return API.post('faculty-member/update-profile', {
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
    page: number,
    numOfItems: number
) {
    const params = {
        page,
        numOfItems,
    };
    //return API.get<{ /* students: IStudentsApplied[] -> name of array: TYPE[] */}>('/get-applicants/1') // to add job id; when put # can just put 1
    return API.get<{ jobApplications: IJobApplication[], jobApplicationsCount: number }>('faculty-member/get-job-applications/1', { params });
}

export default IJobApplication;
//here can declare interface for students appliead; has to match whatever mari gives back -> export then import it in Studentlist compo
