import React from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';

import { formatDateString, formatSalary } from 'utils/format';
import JobDashboardContext from '../Contexts/JobDashBoard';
import DeleteButton from 'Components/DeleteButton';
import Button from 'Components/Button';
import { IJob, deleteJob } from 'Domains/Jobs/api';
import JobUpdateForm from 'Domains/Jobs/JobUpdateForm';

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
    const getJobDescriptionForDelete = () => {
        const { title, postedOn } = job;
        return `Job title: ${title}, Posted on: ${formatDateString(postedOn)}`;
    };
    const { removeJob } = React.useContext(JobDashboardContext);
    const deleteRequest = React.useCallback(() => deleteJob(job.id), [job.id]);
    return (
        <Card
            variant='outlined'
            style={{
                padding: 40,
                borderRadius: 15,
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
                        {hasPermission ? (
                            <Grid container>
                                <JobUpdateForm
                                    jobInitialValues={{
                                        id: job.id,
                                        title: job.title,
                                        description: job.description,
                                        hoursPerWeek: job.hoursPerWeek,
                                        minSalary: job.minSalary,
                                        maxSalary: job.maxSalary,
                                        targetYears: job.targetYears,
                                        type: job.type,
                                        startDate: formatDateString(
                                            job.startDate,
                                            'yyyy-MM-dd'
                                        ),
                                        endDate: formatDateString(
                                            job.endDate,
                                            'yyyy-MM-dd'
                                        ),
                                        expirationDate: formatDateString(
                                            job.expirationDate,
                                            'yyyy-MM-dd'
                                        ),
                                        collegeId: job.department.college.id,
                                        departmentId: job.department.id,
                                    }}
                                />
                                <DeleteButton
                                    itemName={getJobDescriptionForDelete()}
                                    onDeleteRequest={deleteRequest}
                                    onSuccess={() => removeJob(job.id)}
                                />
                                <Button>Close</Button>
                            </Grid>
                        ) : (
                            <Button>Apply</Button>
                        )}
                    </Grid>
                </Grid>
                <Grid container item spacing={3}>
                    <Grid item container direction='column' spacing={2} md={4}>
                        <Grid item>
                            <SubTitle title={'Salary'} />
                            <Typography>
                                {job.minSalary > 0
                                    ? formatSalary(job.minSalary, job.maxSalary)
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
                            <Typography>{job.department.name}</Typography>
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
