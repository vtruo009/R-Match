import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import DeleteButton from 'Components/DeleteButton';
import WorkExperienceUpdateForm from '../WorkExperienceUpdateForm';
import { formatDateString } from 'utils/format';
import { IWorkExperience, deleteWorkExperience } from '../api';

interface WorkExperienceProps {
    workExperience: IWorkExperience;
    hasPermission: boolean;
}

function WorkExperience({
    workExperience,
    hasPermission,
}: WorkExperienceProps) {
    const deleteRequest = React.useCallback(
        () => deleteWorkExperience(workExperience.id),
        [workExperience.id]
    );
    return (
        <Grid container spacing={1} alignItems='center' justify='center'>
            <Grid container item xs={12} justify='space-between'>
                <Grid item>
                    <Typography variant='h6' color='primary'>
                        {workExperience.title} 
                    </Typography>
                </Grid>
                {hasPermission && (
                    <Grid item>
                        <Grid container>
                            <WorkExperienceUpdateForm
                                workExperienceInitialValues={{
                                    ...workExperience,
                                    startDate: formatDateString(
                                        workExperience.startDate,
                                        'yyyy-MM-dd'
                                    ),
                                    endDate: formatDateString(
                                        workExperience.endDate,
                                        'yyyy-MM-dd'
                                    ),
                                }}
                            />
                            <DeleteButton
                                message={`Please confirm deletion of work experience: ${workExperience.title}`}
                                onSuccess={() => {}}
                                onDeleteRequest={deleteRequest}
                            />
                        </Grid>
                    </Grid>
                )}
            </Grid>
            <Grid item xs={12}>
                <Typography variant='h6'>{workExperience.employer}</Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography variant='body1'>
                    {formatDateString(workExperience.startDate)}
                    {workExperience.endDate &&
                        ` - ${formatDateString(workExperience.endDate)}`}
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography variant='body1'>
                    {workExperience.description}
                </Typography>
            </Grid>
        </Grid>
    );
}

export default WorkExperience;
