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

    return isLoading ? (
        <Loader center />
    ) : (
        <div>
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
                    <JobCreateForm onSuccess={sendRequest} />
                </Grid>
            </Grid>
            {jobsPosted.length > 0 ? (
                <JobDashboardContext.Provider value={{ removeJob }}>
                    <JobResults jobs={jobsPosted} />
                </JobDashboardContext.Provider>
            ) : (
                <> </>
            )}
        </div>
    );
}

export default JobDashboard;
