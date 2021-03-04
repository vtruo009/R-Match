import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';

import { formatDateString, formatSalary } from 'utils/format';
import ReadMoreOrLess from 'Components/ReadMoreOrLess';
import Card from 'Components/Card';
import { IJob } from 'Domains/Jobs/api';
import JobFacultyActions from 'Domains/Jobs/JobFacultyActions';
import JobStudentActions from 'Domains/Jobs/JobStudentActions';
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
                    <Grid item xs={12}>
                        <Typography variant='h5' color='primary'>
                            {job.title}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        {hasPermission ? (
                            <JobFacultyActions job={job} />
                        ) : (
                            <JobStudentActions jobId={job.id} />
                        )}
                    </Grid>
                    <Grid item xs={4}>
                        <SubTitle title={'Job type(s)'} />
                        {job.type.map((jobType) => (
                            <Chip
                                style={{ margin: 2 }}
                                color='primary'
                                label={jobType}
                            />
                        ))}
                    </Grid>
                    <Grid item xs={4}>
                        <SubTitle title={'Target years'} />
                        <Typography>
                            {job.targetYears.map((targetYear) => (
                                <Chip
                                    style={{ margin: 2 }}
                                    color='secondary'
                                    label={targetYear}
                                />
                            ))}
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <SubTitle title={'Department'} />
                        <Typography>{job.department.name}</Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <SubTitle title={'Salary'} />
                        <Typography>
                            {job.minSalary > 0
                                ? formatSalary(job.minSalary, job.maxSalary)
                                : 'None'}
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <SubTitle title={'Status'} />
                        <Typography>{job.status}</Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <SubTitle title={'Hours per week'} />
                        <Typography>{job.hoursPerWeek}</Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <SubTitle title={'Start date'} />
                        <Typography>
                            {formatDateString(job.startDate)}
                        </Typography>
                    </Grid>
                    {job.endDate && (
                        <Grid item xs={4}>
                            <SubTitle title={'End date'} />
                            <Typography>
                                {formatDateString(job.endDate)}
                            </Typography>
                        </Grid>
                    )}
                    {job.expirationDate && (
                        <Grid item xs={4}>
                            <SubTitle title={'Expiration date'} />
                            <Typography>
                                {formatDateString(job.expirationDate)}
                            </Typography>
                        </Grid>
                    )}
                </Grid>
                <Grid container direction='column' item>
                    <Grid item>
                        <Typography variant='h6' color='primary'>
                            Description
                        </Typography>
                    </Grid>
                    <Grid item>
                        <ReadMoreOrLess
                            content={job.description}
                            charLimit={1750}
                        />
                    </Grid>
                </Grid>
            </Card>
        </div>
    );
}

export default JobSummary;
