import React from 'react';
import Grid from '@material-ui/core/Grid';

import useDialog from 'hooks/useDialog';
import useApi from 'hooks/useApi';
import BaseProfile from 'Components/BaseProfile';
import LabelValue from 'Components/LabelValue';
import LabelValues from 'Components/LabelValues';
import Loader from 'Components/Loader';
import StudentProfileForm from 'Domains/Student/StudentProfileForm';
import WorkExperiences from 'Domains/Student/WorkExperiences';
import { getStudentProfile, IStudent } from 'Domains/Student/api';
import { AuthContext } from 'Contexts/AuthContext';

const workExperiencesDummy = [
    {
        id: 1,
        startDate: '2021-01-29T03:31:04.627Z',
        endDate: '2021-01-29T03:31:04.627Z',
        title: 'ARC Tutor',
        employer: 'UCR Academic Resource center',
        description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    },
    {
        id: 2,
        startDate: '2021-01-29T03:31:04.627Z',
        endDate: '2021-01-29T03:31:04.627Z',
        title: 'Web developer',
        employer: 'Microsoft',
        description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    },
    {
        id: 3,
        startDate: '2021-01-29T03:31:04.627Z',
        endDate: '2021-01-29T03:31:04.627Z',
        title: 'Software Engineer Intern',
        employer: 'Google',
        description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    },
];

function StudentProfile() {
    const [studentProfile, setStudentProfile] = React.useState<IStudent>();
    const { user } = React.useContext(AuthContext);
    const [, openDialog, closeDialog, DialogProps, Dialog] = useDialog();

    const getProfileRequest = React.useCallback(
        () => getStudentProfile(user?.specificUserId as number),
        [user?.specificUserId]
    );

    const [sendGetProfileRequest, isGettingProfileLoading] = useApi(
        getProfileRequest,
        {
            onSuccess: (results) => {
                setStudentProfile(results.data.student);
            },
        }
    );

    const getCoursesTitles = () => {
        return studentProfile?.courses.map(
            (course) => `${course.shortTitle} - ${course.fullTitle}`
        );
    };

    const getCoursesIds = () => {
        return studentProfile?.courses.map((course) => course.id);
    };

    React.useEffect(() => {
        sendGetProfileRequest();
    }, [sendGetProfileRequest]);

    return isGettingProfileLoading ? (
        <Loader center />
    ) : studentProfile ? (
        <div>
            <Grid container spacing={2} justify='center' alignItems='center'>
                <BaseProfile
                    id={studentProfile.id}
                    firstName={studentProfile.user.firstName}
                    middleName={studentProfile.user.middleName}
                    email={studentProfile.user.email}
                    lastName={studentProfile.user.lastName}
                    biography={studentProfile.user.biography}
                    department={studentProfile.department}
                    onEdit={openDialog}
                />
                <Grid item md={4} xs={12}>
                    <LabelValue
                        label='Class Standing'
                        value={studentProfile.classStanding}
                    />
                </Grid>
                <Grid item md={4} xs={12}>
                    <LabelValue label='SID' value={studentProfile.sid} />
                </Grid>
                <Grid item md={4} xs={12}>
                    <LabelValue label='GPA' value={studentProfile.gpa} />
                </Grid>
                <Grid item md={12} xs={12}>
                    <LabelValues
                        label='Courses Taken'
                        values={getCoursesTitles()}
                    />
                </Grid>
                <Grid item md={12} xs={12}>
                    <WorkExperiences workExperiences={workExperiencesDummy} />
                </Grid>
            </Grid>
            <Dialog {...DialogProps} title='Edit Profile'>
                <StudentProfileForm
                    onClose={closeDialog}
                    onSuccess={sendGetProfileRequest}
                    studentProfileInformation={{
                        id: studentProfile.id,
                        userId: studentProfile.user.id,
                        firstName: studentProfile.user.firstName,
                        middleName: studentProfile.user.middleName,
                        lastName: studentProfile.user.lastName,
                        collegeId: studentProfile.department?.college.id,
                        departmentId: studentProfile.department?.id,
                        sid: studentProfile.sid,
                        gpa: studentProfile.gpa?.toString(),
                        classStanding: studentProfile.classStanding,
                        email: studentProfile.user.email,
                        biography: studentProfile.user.biography,
                        courseIds: getCoursesIds(),
                        // resume: studentProfile.resume,
                        // transcript: studentProfile.transcript,
                        // workStartDate: studentProfile.workStartDate,
                        // workEndDate: studentProfile.workEndDate,
                        // workEmployer: studentProfile.workEmployer,
                        // workDescription: studentProfile.workDescription,
                    }}
                />
            </Dialog>
        </div>
    ) : (
        <> </>
    );
}

export default StudentProfile;
