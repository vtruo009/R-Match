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

//TODO: DEFINE THIS LATER!
export async function createFacultyMemberProfile(facultyMemberProfile: IFacultyMemberProfileForm) {
    return API.post('facultyMemberProfile/create', {
        facultyMemberProfile: {
            ...facultyMemberProfile,
        }
    });
}

export async function getStudentsApplied() { // as of now no param
    //return API.get<{ /* students: IStudentsApplied[] -> name of array: TYPE[] */}>('/get-applicants/1') // to add job id; when put # can just put 1
    return API.get<{ jobApplications: IJobApplication[] }>('faculty-member/get-job-applications/1');
}

export default IJobApplication;
//here can declare interface for students appliead; has to match whatever mari gives back -> export then import it in Studentlist compo