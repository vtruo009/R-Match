import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import EditButton from 'Components/EditButton';
import DeleteButton from 'Components/DeleteButton';
import { formatDateString } from 'utils/format';
import { IWorkExperience } from '../api';

interface WorkExperienceProps {
    workExperience: IWorkExperience;
}

function WorkExperience({
    workExperience: { startDate, endDate, title, employer, description },
}: WorkExperienceProps) {
    return (
        <Grid container spacing={1} alignItems='center' justify='center'>
            <Grid container item xs={12} justify='space-between'>
                <Typography variant='h6' color='primary'>
                    {title}
                </Typography>
                <EditButton />
                {/* <DeleteButton
                    message={`Please confirm deletion of work experience: ${title}`}
                    onSuccess={() => {}}
                    onDeleteRequest={() => {}}
                /> */}
            </Grid>
            <Grid item xs={12}>
                <Typography variant='body1'>{employer}</Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography variant='body1'>
                    {formatDateString(startDate)} - {' '}
                    {endDate && formatDateString(endDate)}
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography variant='body1'>{description}</Typography>
            </Grid>
        </Grid>
    );
}

export default WorkExperience;
