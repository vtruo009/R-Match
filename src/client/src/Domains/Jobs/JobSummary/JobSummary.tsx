import React from 'react';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { formatDate } from '../../../utils/format';
import { IJob } from '../api/api';
import { isGreaterThanZero } from '../../../utils/helpers';
import SalaryDisplayer from '../SalaryDisplayer/SalaryDisplayer';

interface props {
    job: IJob;
}

function JobSummary({ job }: props) {
    return (
        <Box
            style={{ padding: 30, position: 'fixed' }}
            borderRadius={16}
            border={1}
            borderColor='#b2bec3'
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
                <Grid container item spacing={3} justify='center'>
                    <Grid item container direction='column' spacing={2} md={4}>
                        <Grid item>
                            <Typography variant='subtitle1' color='primary'>
                                Salary
                            </Typography>
                            {isGreaterThanZero(job.minSalary) ? (
                                <SalaryDisplayer
                                    minSalary={job.minSalary}
                                    maxSalary={job.maxSalary}
                                />
                            ) : (
                                <Typography> None </Typography>
                            )}
                        </Grid>
                        <Grid item>
                            <Typography variant='subtitle1' color='primary'>
                                Hours per week
                            </Typography>
                            <Typography>{job.hoursPerWeek}</Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant='subtitle1' color='primary'>
                                Target years
                            </Typography>
                            <Typography>
                                {job.targetYears.join(', ')}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid item container direction='column' spacing={2} md={4}>
                        <Grid item>
                            <Typography variant='subtitle1' color='primary'>
                                Start date
                            </Typography>
                            <Typography>{formatDate(job.startDate)}</Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant='subtitle1' color='primary'>
                                End date
                            </Typography>
                            <Typography>{formatDate(job.endDate)}</Typography>
                        </Grid>
                        {job.expirationDate && (
                            <Grid item>
                                <Typography variant='subtitle1' color='primary'>
                                    Expiration date
                                </Typography>
                                <Typography>
                                    {formatDate(job.expirationDate)}
                                </Typography>
                            </Grid>
                        )}
                    </Grid>
                    <Grid item container direction='column' spacing={2} md={4}>
                        <Grid item>
                            <Typography variant='subtitle1' color='primary'>
                                Job Type(s)
                            </Typography>
                            <Typography>{job.type.join(', ')}</Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant='subtitle1' color='primary'>
                                Department
                            </Typography>
                            {/* TODO: In the future this attribute should be called departmentName */}
                            <Typography>{job.departmentId}</Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container item>
                    <Typography variant='body1'>{job.description}</Typography>
                </Grid>
            </Grid>
        </Box>
    );
}

export default JobSummary;
