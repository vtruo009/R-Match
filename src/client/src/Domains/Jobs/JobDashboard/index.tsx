import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
import JobIcon from '@material-ui/icons/WorkOutline';

import JobResults from 'Domains/Jobs/JobResults';
import JobCreateForm from 'Domains/Jobs/JobCreateForm';
import Loader from 'Components/Loader';
import useApi from 'hooks/useApi';
import { getPostedJobs, IJob } from '../api/index';
import JobDashboardContext from '../Contexts/JobDashBoard';
import { IJobUpdateFormValues } from '../JobUpdateForm';

function JobDashboard() {
    const [jobsPosted, setJobsPosted] = React.useState<IJob[]>([]);
    const request = React.useCallback(() => getPostedJobs(), []);
    const [sendRequest, isLoading] = useApi(request, {
        onSuccess: (response) => {
            setJobsPosted(response.data.jobs);
        },
    });
    React.useEffect(() => sendRequest(), [sendRequest]);

    const removeJob = (jobToRemoveId: number) => {
        const jobsFiltered = jobsPosted.filter(
            (job) => job.id !== jobToRemoveId
        );
        setJobsPosted(jobsFiltered);
    };

    const updateJob = (updatedJob: IJobUpdateFormValues) => {
        const jobsToUpdate = [...jobsPosted];
        const indexOfJobToUpdate = jobsPosted.findIndex(
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
        setJobsPosted(jobsToUpdate);
    };

    return isLoading ? (
        <Loader center />
    ) : (
        <JobDashboardContext.Provider
            value={{ removeJob, addJob: () => sendRequest(), updateJob }}
        >
            <Grid container spacing={3} alignItems='center'>
                <Grid item>
                    <Typography variant='h3' color='primary'>
                        Jobs Posted
                    </Typography>
                </Grid>
                <Grid item>
                    <Badge badgeContent={jobsPosted.length} color='primary'>
                        <JobIcon />
                    </Badge>
                </Grid>
                <Grid item>
                    <JobCreateForm />
                </Grid>
            </Grid>
            {jobsPosted.length > 0 && <JobResults jobs={jobsPosted} />}
        </JobDashboardContext.Provider>
    );
}

export default JobDashboard;
