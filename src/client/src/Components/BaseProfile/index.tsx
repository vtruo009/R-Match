import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import Card from 'Components/Card';
import LabelValue from 'Components/LabelValue';
import EditButton from 'Components/EditButton';
import MessageButton from 'Components/MessageButton';
import { IDepartment } from 'Components/AcademicInfo/api';

interface BaseProfileProps {
    firstName: string;
    middleName?: string;
    lastName: string;
    biography?: string;
    email: string;
    department?: IDepartment;
    onEdit: () => void;
    hasPermission: boolean;
}

function BaseProfile({
    firstName,
    middleName,
    lastName,
    biography,
    email,
    department,
    onEdit,
    hasPermission,
}: BaseProfileProps) {
    const getUserName = () => {
        const middleInitial = middleName ? middleName.charAt(0) + '.' : '';
        return `${firstName} ${middleInitial} ${lastName}`;
    };
    return (
        <Grid container item spacing={2} justify='center' alignItems='center'>
            <Grid item md={12} xs={12}>
                <Card>
                    <Grid
                        container
                        direction='column'
                        alignItems='center'
                        justify='center'
                        spacing={3}
                    >
                        {hasPermission && (
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
                                {!hasPermission && (
                                    <MessageButton email={email} />
                                )}
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
