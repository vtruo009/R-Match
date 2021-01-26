import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
import JobIcon from '@material-ui/icons/WorkOutline';

import JobResults from 'Domains/Jobs/JobResults';
import JobCreateForm from 'Domains/Jobs/JobCreateForm';
import { IJob, statusType } from '../api/index';
import JobsContext from '../Contexts/JobsContext';
import { IJobUpdateFormValues } from '../JobUpdateForm';
import { AuthContext } from 'Contexts/AuthContext';

interface JobDashboardProps {
    jobs: IJob[];
    setJobs: (job: IJob[]) => void;
    title: string;
    reSendRequest: () => void;
}

function JobDashboard({
    jobs,
    setJobs,
    title,
    reSendRequest,
}: JobDashboardProps) {
    const { user } = React.useContext(AuthContext);

    const removeJob = (jobToRemoveId: number) => {
        const jobsFiltered = jobs.filter((job) => job.id !== jobToRemoveId);
        setJobs(jobsFiltered);
    };

    const updateJob = (updatedJob: IJobUpdateFormValues) => {
        const jobsToUpdate = [...jobs];
        const indexOfJobToUpdate = jobs.findIndex(
            (job) => job.id === updatedJob.id
        );

        if (indexOfJobToUpdate === -1) return;

        let jobToUpdate = jobsToUpdate[indexOfJobToUpdate];
        jobsToUpdate[indexOfJobToUpdate] = {
            id: updatedJob.id,
            description: updatedJob.description,
            type: updatedJob.type,
            title: updatedJob.title,
            targetYears: updatedJob.targetYears,
            hoursPerWeek: updatedJob.hoursPerWeek as number,
            startDate: updatedJob.startDate,
            endDate: updatedJob.endDate,
            expirationDate: updatedJob.expirationDate,
            minSalary: updatedJob.minSalary as number,
            maxSalary: updatedJob.maxSalary,
            postedOn: jobToUpdate.postedOn,
            status: jobToUpdate.status,
            department: jobToUpdate.department,
            facultyMember: jobToUpdate.facultyMember,
        };
        setJobs(jobsToUpdate);
    };

    const updateJobStatus = (jobId: number, newStatus: statusType) => {
        const jobsToUpdate = [...jobs];
        const indexOfJobToUpdate = jobs.findIndex((job) => job.id === jobId);
        if (indexOfJobToUpdate === -1) return;
        jobsToUpdate[indexOfJobToUpdate].status = newStatus;
        setJobs(jobsToUpdate);
    };

    return (
        <JobsContext.Provider
            value={{
                removeJob,
                addJob: () => reSendRequest(),
                updateJob,
                updateJobStatus,
                showApply: false,
            }}
        >
            <Grid container spacing={3} alignItems='center'>
                <Grid item>
                    <Typography variant='h3' color='primary'>
                        {title}
                    </Typography>
                </Grid>
                <Grid item>
                    <Badge badgeContent={jobs.length} color='primary'>
                        <JobIcon />
                    </Badge>
                </Grid>
                {user?.role === 'facultyMember' && (
                    <Grid item>
                        <JobCreateForm />
                    </Grid>
                )}
            </Grid>
            {jobs.length > 0 && <JobResults jobs={jobs} />}
        </JobsContext.Provider>
    );
}

export default JobDashboard;
