import React from 'react';
import Grid from '@material-ui/core/Grid';
import SchoolOutlinedIcon from '@material-ui/icons/SchoolOutlined';

import { AuthContext } from 'Contexts/AuthContext';
import useDialog from 'hooks/useDialog';
import useApi from 'hooks/useApi';
import BaseProfile from 'Components/BaseProfile';
import LabelValue from 'Components/LabelValue';
import LabelValues from 'Components/LabelValues';
import Loader from 'Components/Loader';
import StudentProfileForm from 'Domains/Student/StudentProfileForm';
import WorkExperiences from 'Domains/Student/WorkExperiences';
import { getStudentProfile, IStudent } from 'Domains/Student/api';

interface StudentProfileProps {
    studentId: number;
}

function StudentProfile({ studentId }: StudentProfileProps) {
    const [studentProfile, setStudentProfile] = React.useState<IStudent>();
    const { openDialog, closeDialog, DialogProps, Dialog } = useDialog();
    const { user } = React.useContext(AuthContext);

    const getProfileRequest = React.useCallback(
        () => getStudentProfile(studentId),
        [studentId]
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

    const isUserProfileOwner =
        user?.role === 'student' && user?.specificUserId === studentId;

    React.useEffect(() => {
        sendGetProfileRequest();
    }, [sendGetProfileRequest]);

    return isGettingProfileLoading ? (
        <Loader centerPage />
    ) : studentProfile ? (
        <div>
            <Grid container spacing={2} justify='center' alignItems='center'>
                <BaseProfile
                    firstName={studentProfile.user.firstName}
                    middleName={studentProfile.user.middleName}
                    email={studentProfile.user.email}
                    lastName={studentProfile.user.lastName}
                    biography={studentProfile.user.biography}
                    department={studentProfile.department}
                    onEdit={openDialog}
                    hasPermission={isUserProfileOwner}
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
                        icon={<SchoolOutlinedIcon />}
                    />
                </Grid>
                <Grid item md={12} xs={12}>
                    <WorkExperiences
                        hasPermission={isUserProfileOwner}
                        studentId={studentId}
                    />
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
                    }}
                />
            </Dialog>
        </div>
    ) : (
        <> </>
    );
}

export default StudentProfile;
