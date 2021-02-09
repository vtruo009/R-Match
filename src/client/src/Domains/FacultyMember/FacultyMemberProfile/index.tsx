import React from 'react';
import Grid from '@material-ui/core/Grid';

import useDialog from 'hooks/useDialog';
import useApi from 'hooks/useApi';
import BaseProfile from 'Components/BaseProfile';
import LabelValue from 'Components/LabelValue';
import Loader from 'Components/Loader';
import FacultyMemberProfileForm from 'Domains/FacultyMember/FacultyMemberProfileForm';
import {
    getFacultyMemberProfile,
    IFacultyMember,
} from 'Domains/FacultyMember/api';
import { AuthContext } from 'Contexts/AuthContext';

function FacultyMemberProfile() {
    const [
        facultyMemberProfile,
        setFacultyMemberProfile,
    ] = React.useState<IFacultyMember>();
    const { user } = React.useContext(AuthContext);
    const [, openDialog, closeDialog, DialogProps, Dialog] = useDialog();

    const isUserProfileOwner =
        user?.role === 'facultyMember' &&
        user?.specificUserId === facultyMemberProfile?.id;

    const getProfileRequest = React.useCallback(
        () => getFacultyMemberProfile(user?.specificUserId as number),
        [user?.specificUserId]
    );

    const [sendGetProfileRequest, isGettingProfileLoading] = useApi(
        getProfileRequest,
        {
            onSuccess: (results) => {
                setFacultyMemberProfile(results.data.facultyMember);
            },
        }
    );

    React.useEffect(() => {
        sendGetProfileRequest();
    }, [sendGetProfileRequest]);

    return isGettingProfileLoading ? (
        <Loader center />
    ) : facultyMemberProfile ? (
        <div>
            <Grid container spacing={2} justify='center' alignItems='center'>
                <BaseProfile
                    firstName={facultyMemberProfile.user.firstName}
                    middleName={facultyMemberProfile.user.middleName}
                    email={facultyMemberProfile.user.email}
                    lastName={facultyMemberProfile.user.lastName}
                    biography={facultyMemberProfile.user.biography}
                    department={facultyMemberProfile.department}
                    onEdit={openDialog}
                    hasPermission={isUserProfileOwner}
                />
                <Grid item md={4} xs={12}>
                    <LabelValue
                        label='Website'
                        value={facultyMemberProfile.websiteLink}
                    />
                </Grid>
                <Grid item md={4} xs={12}>
                    <LabelValue
                        label='Office'
                        value={facultyMemberProfile.office}
                    />
                </Grid>
                <Grid item md={4} xs={12}>
                    <LabelValue
                        label='Title'
                        value={facultyMemberProfile.title}
                    />
                </Grid>
            </Grid>
            <Dialog {...DialogProps} title='Edit Profile'>
                <FacultyMemberProfileForm
                    onClose={closeDialog}
                    onSuccess={sendGetProfileRequest}
                    facultyMemberProfileInformation={{
                        id: facultyMemberProfile.id,
                        userId: facultyMemberProfile.user.id,
                        firstName: facultyMemberProfile.user.firstName,
                        middleName: facultyMemberProfile.user.middleName,
                        lastName: facultyMemberProfile.user.lastName,
                        collegeId: facultyMemberProfile.department?.college.id,
                        departmentId: facultyMemberProfile.department?.id,
                        email: facultyMemberProfile.user.email,
                        biography: facultyMemberProfile.user.biography,
                        websiteLink: facultyMemberProfile.websiteLink,
                        office: facultyMemberProfile.office,
                        title: facultyMemberProfile.title,
                    }}
                />
            </Dialog>
        </div>
    ) : (
        <> </>
    );
}

export default FacultyMemberProfile;
