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
import { getStudentProfile, IStudent } from 'Domains/Student/api/api';
import { AuthContext } from 'Contexts/AuthContext';

function StudentProfile() {
    const [studentProfile, setStudentProfile] = React.useState<IStudent>();
    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
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

    React.useEffect(() => {
        sendGetProfileRequest();
    }, [sendGetProfileRequest]);

    const getCoursesTitles = () => {
        return studentProfile?.courses.map(
            (course) => `${course.shortTitle} - ${course.fullTitle}`
        );
    };

    const getStudentName = () => {
        const middleName = studentProfile?.user.middleName;
        const middleInitial = middleName ? middleName.charAt(0) + '.' : '';
        return `${studentProfile?.user.firstName} ${middleInitial} ${studentProfile?.user.lastName}`;
    };

    return isGettingProfileLoading ? (
        <Loader center />
    ) : studentProfile ? (
        <div style={{ padding: 50 }}>
            <Grid container spacing={2}>
                <Grid item container spacing={2} justify='center'>
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
                                            onClick={handleClickOpen}
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
                </Grid>
            </Grid>
            <Dialog open={open} onClose={handleClose} title='Edit Profile'>
                <StudentProfileForm
                    onCancel={handleClose}
                    studentProfileInformation={{
                        firstName: studentProfile.user.firstName,
                        middleName: studentProfile.user.middleName,
                        lastName: studentProfile.user.lastName,
                        collegeId: studentProfile.department?.college.id,
                        departmentId: studentProfile.department?.id,
                        sid: studentProfile.sid,
                        classStanding: studentProfile.classStanding,
                        email: studentProfile.user.email,
                        biography: studentProfile.user.biography,
                        courses: getCoursesTitles(),
                    }}
                />
            </Dialog>
        </div>
    ) : (
        <> </>
    );
}

export default StudentProfile;
