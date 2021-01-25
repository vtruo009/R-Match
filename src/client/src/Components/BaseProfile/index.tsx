import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import Card from 'Components/Card';
import LabelValue from 'Components/LabelValue';
import EditButton from 'Components/EditButton';
import { IDepartment } from 'Components/AcademicInfo/api';
import { AuthContext } from 'Contexts/AuthContext';

interface BaseProfileProps {
    id?: number;
    firstName: string;
    middleName?: string;
    lastName: string;
    biography?: string;
    email: string;
    department?: IDepartment;
    onEdit: () => void;
}

function BaseProfile({
    id,
    firstName,
    middleName,
    lastName,
    biography,
    email,
    department,
    onEdit,
}: BaseProfileProps) {
    const { user } = React.useContext(AuthContext);
    const isUserProfileOwner = () => user?.specificUserId === id;
    const getUserName = () => {
        const middleInitial = middleName ? middleName.charAt(0) + '.' : '';
        return `${firstName} ${middleInitial} ${lastName}`;
    };
    return (
        <Grid container item spacing={2} justify='center' alignItems='center'>
            <Grid item md={12} xs={12}>
                <Card colorBorder>
                    <Grid
                        container
                        direction='column'
                        alignItems='center'
                        justify='center'
                        spacing={3}
                    >
                        {isUserProfileOwner() && (
                            <Grid container item justify='flex-end'>
                                <EditButton onClick={onEdit} />
                            </Grid>
                        )}
                        <Grid item>
                            <Avatar
                                alt={getUserName()}
                                style={{ width: 170, height: 170 }}
                            />
                        </Grid>
                        <Grid item>
                            <Typography variant='h4'>
                                {getUserName()}
                            </Typography>
                        </Grid>
                    </Grid>
                </Card>
            </Grid>
            <Grid item md={5} xs={12}>
                <LabelValue label='College' value={department?.college.name} />
            </Grid>
            <Grid item md={4} xs={12}>
                <LabelValue label='Department' value={department?.name} />
            </Grid>
            <Grid item md={3} xs={12}>
                <LabelValue label='Email' value={email} />
            </Grid>
            <Grid item md={12} xs={12}>
                <LabelValue label='About' value={biography} isParagraph />
            </Grid>
        </Grid>
    );
}

export default BaseProfile;
