import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';

import useApi from 'hooks/useApi';
import LabelValue from 'Components/LabelValue';
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
        return studentProfile?.courses.map((course) => course.title);
    };

    return isGettingProfileLoading ? (
        <Loader center />
    ) : studentProfile ? (
        <Paper style={{ padding: 50 }}>
            <Grid container spacing={3}>
                <Grid item container justify='flex-start'>
                    <Grid item>
                        <Typography variant='h4'>Student Profile</Typography>
                    </Grid>
                    {isUserProfileOwner() && (
                        <Grid item>
                            <IconButton
                                color='primary'
                                onClick={handleClickOpen}
                            >
                                <EditIcon />
                            </IconButton>
                        </Grid>
                    )}
                </Grid>
                <Grid item container spacing={5}>
                    <Grid item md={3} xs={12}>
                        <LabelValue
                            label='First Name'
                            value={studentProfile.user.firstName}
                        />
                    </Grid>
                    <Grid item md={3} xs={12}>
                        <LabelValue
                            label='Middle Name'
                            value={studentProfile.user.middleName}
                        />
                    </Grid>
                    <Grid item md={3} xs={12}>
                        <LabelValue
                            label='Last Name'
                            value={studentProfile.user.lastName}
                        />
                    </Grid>
                    <Grid item md={3} xs={12}>
                        <LabelValue
                            label='Class Standing'
                            value={studentProfile.classStanding}
                        />
                    </Grid>
                </Grid>
                <Grid item container spacing={5}>
                    <Grid item md={3} xs={12}>
                        <LabelValue
                            label='Class Standing'
                            value={studentProfile.classStanding}
                        />
                    </Grid>
                    <Grid item md={3} xs={12}>
                        <LabelValue
                            label='Courses Taken'
                            value={getCoursesTitles()}
                        />
                    </Grid>
                    <Grid item md={3} xs={12}>
                        <LabelValue
                            label='College'
                            value={studentProfile.department?.college.name}
                        />
                    </Grid>
                    <Grid item md={3} xs={12}>
                        <LabelValue
                            label='Department'
                            value={studentProfile.department?.name}
                        />
                    </Grid>
                </Grid>
                {isUserProfileOwner() && (
                    <Grid item container spacing={5}>
                        <Grid item md={3} xs={12}>
                            <LabelValue
                                label='SID'
                                value={studentProfile.sid}
                            />
                        </Grid>
                        <Grid item md={3} xs={12}>
                            <LabelValue
                                label='Email'
                                value={studentProfile.user.email}
                            />
                        </Grid>
                    </Grid>
                )}
                <Grid item container>
                    <LabelValue
                        label='About'
                        value={studentProfile.user.biography}
                        isParagraph
                    />
                </Grid>
            </Grid>
            <Dialog open={open} onClose={handleClose} maxWidth='md' fullWidth>
                <StudentProfileForm
                    studentProfileInformation={{
                        firstName: studentProfile.user.firstName,
                        middleName: studentProfile.user.middleName,
                        lastName: studentProfile.user.lastName,
                        department: studentProfile.department?.name,
                        sid: studentProfile.sid,
                        classStanding: studentProfile.classStanding,
                        email: studentProfile.user.email,
                        biography: studentProfile.user.email,
                        courses: getCoursesTitles(),
                    }}
                />
            </Dialog>
        </Paper>
    ) : (
        <> </>
    );
}

export default StudentProfile;
