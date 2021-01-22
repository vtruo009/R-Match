import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import Card from '@material-ui/core/Card';

import Dialog from 'Components/Dialog';
import useApi from 'hooks/useApi';
import LabelValue from 'Components/LabelValue';
import LabelValues from 'Components/LabelValues';
import Loader from 'Components/Loader';
import StudentProfileForm from 'Domains/Student/StudentProfileForm';
import { getStudentProfile, IStudent } from 'Domains/Student/api';
import { AuthContext } from 'Contexts/AuthContext';

function StudentProfile() {
    const [studentProfile, setStudentProfile] = React.useState<IStudent>();
    const [open, setOpen] = React.useState(false);
    const { user } = React.useContext(AuthContext);

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

    const isUserProfileOwner = () =>
        user?.specificUserId === studentProfile?.id;

    const getCoursesTitles = () => {
        return studentProfile?.courses.map(
            (course) => `${course.shortTitle} - ${course.fullTitle}`
        );
    };

    const getCoursesIds = () => {
        return studentProfile?.courses.map((course) => course.id);
    };

    const getStudentName = () => {
        const middleName = studentProfile?.user.middleName;
        const middleInitial = middleName ? middleName.charAt(0) + '.' : '';
        return `${studentProfile?.user.firstName} ${middleInitial} ${studentProfile?.user.lastName}`;
    };

    React.useEffect(() => {
        sendGetProfileRequest();
    }, [sendGetProfileRequest]);

    return isGettingProfileLoading ? (
        <Loader center />
    ) : studentProfile ? (
        <div>
            <Grid container spacing={2} justify='center' alignItems='center'>
                <Grid item md={12} xs={12}>
                    <Card variant='outlined' style={{ padding: 30 }}>
                        <Grid
                            container
                            direction='column'
                            alignItems='center'
                            justify='center'
                            spacing={3}
                        >
                            {isUserProfileOwner() && (
                                <Grid container item justify='flex-end'>
                                    <IconButton
                                        color='primary'
                                        onClick={() => setOpen(true)}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                </Grid>
                            )}
                            <Grid item>
                                <Avatar
                                    alt={getStudentName()}
                                    style={{ width: 170, height: 170 }}
                                />
                            </Grid>
                            <Grid item>
                                <Typography variant='h4'>
                                    {getStudentName()}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
                <Grid item md={4} xs={12}>
                    <LabelValue
                        label='Class Standing'
                        value={studentProfile.classStanding}
                    />
                </Grid>
                <Grid item md={4} xs={12}>
                    <LabelValue
                        label='College'
                        value={studentProfile.department?.college.name}
                    />
                </Grid>
                <Grid item md={4} xs={12}>
                    <LabelValue
                        label='Department'
                        value={studentProfile.department?.name}
                    />
                </Grid>
                <Grid item md={12} xs={12}>
                    <LabelValue
                        label='About'
                        value={studentProfile.user.biography}
                        isParagraph
                    />
                </Grid>
                {isUserProfileOwner() && (
                    <Grid item container spacing={2}>
                        <Grid item md={6} xs={12}>
                            <LabelValue
                                label='SID'
                                value={studentProfile.sid}
                            />
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <LabelValue
                                label='Email'
                                value={studentProfile.user.email}
                            />
                        </Grid>
                    </Grid>
                )}
                <Grid item md={12} xs={12}>
                    <LabelValues
                        label='Courses Taken'
                        values={getCoursesTitles()}
                    />
                </Grid>
                <Grid container spacing={2} justify='center' alignItems='center'>
                <Grid item md={12} xs={12}>
                    <Card variant='outlined' style={{ padding: 30 }}>
                    <Grid item>
                            <Typography variant='h5' color='primary'>
                                Work Experiences
                            </Typography>
                        </Grid>
                        <Grid
                            container
                            direction='row'
                            spacing={3}
                        >
                            <Grid item md={6} xs={12}>
                                <LabelValue
                                    label='Start Date'
                                />
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <LabelValue
                                    label='End Date'
                                />
                            </Grid>
                            <Grid item md={12} xs={12}>
                                <LabelValue
                                    label='Title'
                                />
                            </Grid>
                            <Grid item md={12} xs={12}>
                                <LabelValue
                                    label='Employer'
                                />
                            </Grid>
                            <Grid item md={12} xs={12}>
                                <LabelValue
                                    label='Description'
                                />
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
                </Grid> 
            </Grid>
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                title='Edit Profile'
            >
                <StudentProfileForm
                    onClose={() => setOpen(false)}
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
                        workStartDate: studentProfile.workStartDate,
                        workEndDate: studentProfile.workEndDate,
                        workEmployer: studentProfile.workEmployer,
                        workDescription: studentProfile.workDescription,
                    }}
                />
            </Dialog>
        </div>
    ) : (
        <> </>
    );
}

export default StudentProfile;
