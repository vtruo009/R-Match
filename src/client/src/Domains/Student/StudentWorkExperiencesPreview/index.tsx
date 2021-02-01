import React from 'react';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { formatDateString } from 'utils/format';
interface WorkExperienceProps {
    startDate: string;
    endDate?: string;
    title: string;
    employer: string;
    description: string;
}

function StudentWorkExperiencesPreview({
    startDate,
    endDate,
    title,
    employer,
    description,
}: WorkExperienceProps) {
    return (
        <Card variant='outlined' style={{ padding: 30 }}>
            <Grid container spacing={4} alignItems='center' justify='center'>
                <Grid
                    container
                    item
                    md={3}
                    xs={3}
                    justify='center'
                    alignItems='center'
                >
                </Grid>
                <Grid
                    item
                    container
                    direction='row'
                    spacing={1}
                    md={9}
                    xs={12}
                >
                    <Grid item xs={12}>
                        <Typography variant='h6' color='primary'>
                            Title: {title}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant='body1' >
                            Employer: {employer}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant='body1' >
                            Description: {description}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant='body1' >
                            Start Date: {formatDateString(startDate)}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant='body1' >
                            End Date: {formatDateString(endDate)}
                            {/*End Date: { endDate ? endDate : <i> Not provided</i>}*/}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
        </Card>
    );
}

export default StudentWorkExperiencesPreview;
