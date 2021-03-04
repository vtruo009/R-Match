import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import DeleteButton from 'Components/DeleteButton';
import WorkExperienceUpdateForm, {
    IWorkExperienceUpdateFormValues,
} from '../WorkExperienceUpdateForm';
import { formatDateString } from 'utils/format';
import { IWorkExperience, deleteWorkExperience } from '../api';

interface WorkExperienceProps {
    workExperience: IWorkExperience;
    hasPermission: boolean;
    onDeleteWorkExperience: (workExperienceId: number) => void;
    onUpdateWorkExperience: (
        updatedWorkExperience: IWorkExperienceUpdateFormValues
    ) => void;
}

function WorkExperience({
    workExperience: { title, description, employer, startDate, endDate, id },
    hasPermission,
    onDeleteWorkExperience,
    onUpdateWorkExperience,
}: WorkExperienceProps) {
    const deleteRequest = React.useCallback(() => deleteWorkExperience(id), [
        id,
    ]);
    return (
        <Grid container spacing={1} alignItems='center' justify='center'>
            <Grid container item xs={12} justify='space-between'>
                <Grid item>
                    <Typography variant='h6' color='primary'>
                        {title}
                    </Typography>
                </Grid>
                {hasPermission && (
                    <Grid item>
                        <Grid container>
                            <WorkExperienceUpdateForm
                                workExperienceInitialValues={{
                                    id,
                                    title,
                                    description,
                                    employer,
                                    startDate: formatDateString(
                                        startDate,
                                        'yyyy-MM-dd'
                                    ),
                                    endDate: formatDateString(
                                        endDate,
                                        'yyyy-MM-dd'
                                    ),
                                }}
                                onSuccess={onUpdateWorkExperience}
                            />
                            <DeleteButton
                                message={`Please confirm deletion of work experience: ${title}`}
                                onSuccess={() => onDeleteWorkExperience(id)}
                                onDeleteRequest={deleteRequest}
                            />
                        </Grid>
                    </Grid>
                )}
            </Grid>
            <Grid item xs={12}>
                <Typography variant='h6'>{employer}</Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography variant='body1'>
                    {formatDateString(startDate)}
                    {endDate && ` - ${formatDateString(endDate)}`}
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography variant='body1'>{description}</Typography>
            </Grid>
        </Grid>
    );
}

export default WorkExperience;
