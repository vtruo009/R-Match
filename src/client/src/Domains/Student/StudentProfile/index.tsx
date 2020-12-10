import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import useApi from 'hooks/useApi';
import useSnack from 'hooks/useSnack';
import Loader from 'Components/Loader';
import Button from 'Components/Button';
import LabelValue from 'Components/LabelValue';
import { getStudentProfile, IStudent } from 'Domains/Student/api/api';

// TODO: Make sure PDF Files are not greater than some number of bytes

const mockStudent: IStudent = {
    id: 1,
    classStanding: 'Senior',
    sid: 861312308,
    department: {
        id: 1,
        name: 'Computer Science',
        college: {
            id: 1,
            name: 'Bournes College of Engineering',
        },
    },
    user: {
        id: 1,
        firstName: 'Johan',
        middleName: 'Alessandro',
        lastName: 'Guzman Avalos',
        email: 'jguz1505@gmail.com',
        role: 'student',
        biography:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    },
};

function StudentProfile() {
    const [studentProfile, setStudentProfile] = React.useState<IStudent>(
        mockStudent
    );

    const [snack] = useSnack();

    const getProfileRequest = React.useCallback(() => getStudentProfile(), []);
    const [sendGetProfileRequest, isGettingProfileLoading] = useApi(
        getProfileRequest,
        {
            onSuccess: (results) => {
                setStudentProfile(results.data.student);
            },
        }
    );

    React.useEffect(() => {});
    return (
        <Paper style={{ padding: 50 }}>
            <Grid container spacing={3} alignContent='center'>
                <Grid item container justify='flex-start'>
                    <Typography variant='h4'>Student Profile</Typography>
                </Grid>
                <Grid item container spacing={5}>
                    <Grid item container direction='column' spacing={3} md={4}>
                        <LabelValue
                            label='First Name'
                            value={studentProfile.user.firstName}
                        />
                        <LabelValue
                            label='Middle Name'
                            value={studentProfile.user.middleName}
                        />
                        <LabelValue
                            label='Last Name'
                            value={studentProfile.user.lastName}
                        />
                    </Grid>
                    <Grid item container direction='column' spacing={3} md={4}>
                        <LabelValue
                            label='Email'
                            value={studentProfile.user.email}
                        />
                        <LabelValue
                            label='Class Standing'
                            value={studentProfile.classStanding}
                        />
                        <LabelValue label='SID' value={studentProfile.sid} />
                    </Grid>
                    <Grid item container direction='column' spacing={3} md={4}>
                        <LabelValue
                            label='College'
                            value={studentProfile.department?.college.name}
                        />
                        <LabelValue
                            label='Department'
                            value={studentProfile.department?.name}
                        />
                        <LabelValue
                            label='Courses Taken'
                             value={studentProfile.courses?.map(
                                (course) => course.title
                            )}
                        />
                    </Grid>
                    <Grid item container>
                        <LabelValue
                            label='About'
                            value={studentProfile.user.biography}
                            isParagraph
                        />
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    );
}

export default StudentProfile;
