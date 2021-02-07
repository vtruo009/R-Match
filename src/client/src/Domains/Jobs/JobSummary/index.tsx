import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { formatDateString, formatSalary } from 'utils/format';
import Card from 'Components/Card';
import { IJob } from 'Domains/Jobs/api';
import JobActions from 'Domains/Jobs/JobActions';
interface JobSummaryProps {
    job: IJob;
    hasPermission: boolean;
}
interface SubTitleProps {
    title: string;
}
const SubTitle = ({ title }: SubTitleProps) => (
    <Typography variant='subtitle1' color='primary'>
        {title}
    </Typography>
);

function JobSummary({ job, hasPermission }: JobSummaryProps) {
    return (
        <div>
            <Card>
                <Grid container spacing={3} style={{ padding: 20 }}>
                    <Grid container item justify='space-between'>
                        <Grid item xs={6}>
                            <Typography variant='h5' color='primary'>
                                {job.title}
                            </Typography>
                        </Grid>
                        <Grid item>
                            <JobActions
                                hasPermission={hasPermission}
                                job={job}
                            />
                        </Grid>
                    </Grid>
                    <Grid container item spacing={3}>
                        <Grid
                            item
                            container
                            direction='column'
                            spacing={2}
                            md={4}
                        >
                            <Grid item>
                                <SubTitle title={'Salary'} />
                                <Typography>
                                    {job.minSalary > 0
                                        ? formatSalary(
                                              job.minSalary,
                                              job.maxSalary
                                          )
                                        : 'None'}
                                </Typography>
                            </Grid>
                            <Grid item>
                                <SubTitle title={'Hours per week'} />
                                <Typography>{job.hoursPerWeek}</Typography>
                            </Grid>
                            <Grid item>
                                <SubTitle title={'Target years'} />
                                <Typography>
                                    {job.targetYears.join(', ')}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid
                            item
                            container
                            direction='column'
                            spacing={2}
                            md={4}
                        >
                            <Grid item>
                                <SubTitle title={'Job type(s)'} />
                                <Typography>{job.type.join(', ')}</Typography>
                            </Grid>
                            <Grid item>
                                <SubTitle title={'Department'} />
                                <Typography>{job.department.name}</Typography>
                            </Grid>
                            <Grid item>
                                <SubTitle title={'Status'} />
                                <Typography>{job.status}</Typography>
                            </Grid>
                        </Grid>
                        <Grid
                            item
                            container
                            direction='column'
                            spacing={2}
                            md={4}
                        >
                            <Grid item>
                                <SubTitle title={'Start date'} />
                                <Typography>
                                    {formatDateString(job.startDate)}
                                </Typography>
                            </Grid>
                            {job.endDate && (
                                <Grid item>
                                    <SubTitle title={'End date'} />
                                    <Typography>
                                        {formatDateString(job.endDate)}
                                    </Typography>
                                </Grid>
                            )}
                            {job.expirationDate && (
                                <Grid item>
                                    <SubTitle title={'Expiration date'} />
                                    <Typography>
                                        {formatDateString(job.expirationDate)}
                                    </Typography>
                                </Grid>
                            )}
                        </Grid>
                    </Grid>
                    <Grid container direction='column' item>
                        <Grid item>
                            <Typography variant='h6' color='primary'>
                                Description
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant='body1'>
                                {job.description}
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Card>
        </div>
    );
}

export default JobSummary;
