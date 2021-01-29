import React from 'react';
import Grid from '@material-ui/core/Grid';

import useDialog from 'hooks/useDialog';
import useApi from 'hooks/useApi';
import BaseProfile from 'Components/BaseProfile';
import LabelValue from 'Components/LabelValue';
import LabelValues from 'Components/LabelValues';
import Loader from 'Components/Loader';
import StudentProfileForm from 'Domains/Student/StudentProfileForm';
import StudentWorkExperiencesPreview from 'Domains/Student/StudentWorkExperiencesPreview';
import { getStudentProfile, IStudent } from 'Domains/Student/api';
import { AuthContext } from 'Contexts/AuthContext';

/*interface StudentsProps {
    students: IStudent[];
}
*/

const workExperiencesDummy = [
    {
        startDate: '2021-01-29T03:31:04.627Z',
        endDate: '2021-01-29T03:31:04.627Z',
        title: 'Intern',
        employer: 'Google',
        description: 'Some description',
    },
    {
        startDate: '2021-01-29T03:31:04.627Z',
        endDate: '2021-01-29T03:31:04.627Z',
        title: 'Intern',
        employer: 'Google',
        description: 'Some description',
    },
    {
        startDate: '2021-01-29T03:31:04.627Z',
        endDate: '2021-01-29T03:31:04.627Z',
        title: 'Intern',
        employer: 'Google',
        description: 'Some description',
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
                <Grid item md={6} xs={12}>
                    <LabelValue
                        label='Class Standing'
                        value={studentProfile.classStanding}
                    />
                </Grid>
                <Grid item md={6} xs={12}>
                    <LabelValue label='SID' value={studentProfile.sid} />
                </Grid>
                <Grid item md={12} xs={12}>
                    <LabelValues
                        label='Courses Taken'
                        values={getCoursesTitles()}
                    />
                </Grid>
                <Grid
                    container
                    spacing={2}
                    justify='center'
                    alignItems='center'
                >
                    <Grid item md={12} xs={12}>
                        <Card variant='outlined' style={{ padding: 30 }}>
                            <Grid item>
                                <Typography variant='h5' color='primary'>
                                    Work Experiences
                                </Typography>
                            </Grid>
                            <Grid container direction='row' spacing={3}>
                                <Grid
                                    container
                                    item
                                    direction='row'
                                    spacing={6}
                                    xs={12}
                                ></Grid>
                                {workExperiencesDummy.map(
                                    (workExperience, index) => (
                                        <Grid item key={index}>
                                            <StudentWorkExperiencesPreview
                                                startDate={
                                                    workExperience.startDate
                                                }
                                                endDate={workExperience.endDate}
                                                title={workExperience.title}
                                                employer={
                                                    workExperience.employer
                                                }
                                                description={
                                                    workExperience.description
                                                }
                                            />
                                        </Grid>
                                    )
                                )}
                            </Grid>
                        </Card>
                    </Grid>
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
                        classStanding: studentProfile.classStanding,
                        email: studentProfile.user.email,
                        biography: studentProfile.user.biography,
                        courseIds: getCoursesIds(),
                        resume: studentProfile.resume,
                        transcript: studentProfile.transcript,
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
