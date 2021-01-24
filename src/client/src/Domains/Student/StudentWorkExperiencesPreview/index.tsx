import React from 'react';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { IStudent } from 'Domains/Student/api';
import Avatar from '@material-ui/core/Avatar';

interface Props {
    student: IStudent;
}

function StudentWorkExperiencesPreview ({ student }: Props) {
    return (
        <Card
            variant='outlined'
            style={{ padding: 30 }}
        >
            <Grid container spacing={4} alignItems='center' justify='center'>
                <Grid container item md={3} xs={3} justify='center' alignItems='center'>
                    <Avatar style={{ width: 70, height: 70}}/>
                </Grid>
                <Grid
                    item
                    container
                    direction='column'
                    spacing={1}
                    md={9}
                    xs={12}
                >
                    <Grid item>
                        <Typography variant='body1'>
                            Start Date: {student.workStartDate}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant='body1'>
                            End Date: {student.workEndDate !== null ? student.workEndDate : <i> Not provided</i>}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant='body1'>
                            Title: {student.workTitle}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant='body1'>
                           Employer: {student.workEmployer}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant='body1'>
                           Description: {student.workDescription}
                        </Typography>
                    </Grid>
                </Grid>

            </Grid>
        </Card>
    );
}

export default StudentWorkExperiencesPreview; 