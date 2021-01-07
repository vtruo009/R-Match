import API from 'api';
import { IStudentProfileForm } from 'Domains/Student/StudentProfileForm';
import { IUser } from 'Domains/Accounts/api/api';
import { ICourse, IDepartment } from 'Components/AcademicInfo/api';
export const classStandingTypes = [
    {
        label: 'Freshman',
        value: 'Freshman',
    },
    {
        label: 'Sophomore',
        value: 'Sophomore',
    },
    {
        label: 'Junior',
        value: 'Junior',
    },
    {
        label: 'Senior',
        value: 'Senior',
    },
];

export interface IStudent {
    id: number;
    user: IUser;
    department?: IDepartment;
    sid?: number;
    classStanding?: string;
    courses: ICourse[];
    resume?: File;
    transcript?: File;
}

export async function updateStudentProfile(
    studentProfile: IStudentProfileForm
) {
    const body = {
        studentProfile: {
            id: studentProfile.id,
            departmentId: studentProfile.departmentId,
            classStanding: studentProfile.classStanding,
            sid: studentProfile.sid,
            courses: studentProfile.courses?.map((course) => ({
                id: course,
            })),
            user: {
                id: studentProfile.userId,
                firstName: studentProfile.firstName,
                lastName: studentProfile.lastName,
                middleName: studentProfile.middleName,
                biography: studentProfile.biography,
            },
        },
    };
    return API.post('student/update-profile', body);
}
export async function getStudentProfile(studentId: number) {
    return API.get<{ student: IStudent }>(`student/get-profile/${studentId}`);
}
