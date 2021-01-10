import React from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { formatDateString } from 'utils/format';
import { IJob } from 'Domains/Jobs/api';
import Salary from 'Domains/Jobs/Salary';

interface JobSummaryProps {
    job: IJob;
}
interface SubTitleProps {
    title: string;
}
const SubTitle = ({ title }: SubTitleProps) => (
    <Typography variant='subtitle1' color='primary'>
        {title}
    </Typography>
);

function JobSummary({ job }: JobSummaryProps) {
    return (
        <Card
            variant='outlined'
            style={{
                padding: 40,
                position: 'sticky',
                top: '100px',
            }}
        >
            <Grid container spacing={3}>
                <Grid container item justify='space-between'>
                    <Grid item>
                        <Typography variant='h5' color='primary'>
                            {job.title}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Button variant='contained' color='primary'>
                            Apply
                        </Button>
                    </Grid>
                </Grid>
                <Grid container item spacing={3}>
                    <Grid item container direction='column' spacing={2} md={4}>
                        <Grid item>
                            <SubTitle title={'Salary'} />
                            {job.minSalary > 0 ? (
                                <Salary
                                    minSalary={job.minSalary}
                                    maxSalary={job.maxSalary}
                                />
                            ) : (
                                <Typography> None </Typography>
                            )}
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
                    <Grid item container direction='column' spacing={2} md={4}>
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
                    <Grid item container direction='column' spacing={2} md={4}>
                        <Grid item>
                            <SubTitle title={'Job type(s)'} />
                            <Typography>{job.type.join(', ')}</Typography>
                        </Grid>
                        <Grid item>
                            <SubTitle title={'Department'} />
                            <Typography>{job.departmentId}</Typography>
                        </Grid>
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
    );
}

export default JobSummary;
