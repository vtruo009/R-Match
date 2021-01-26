import React from 'react';

import useApi from 'hooks/useApi';
import useSnack from 'hooks/useSnack';
import { IJob, getPostedJobs } from '../api/index';
import JobDashboard from 'Domains/Jobs/JobDashboard';
import Loader from 'Components/Loader';

function JobFacultyMemberDashBoard() {
    const [jobs, setJobs] = React.useState<IJob[]>([]);
    const [snack] = useSnack();
    const getPostedJobsRequest = React.useCallback(() => getPostedJobs(), []);
    const [sendRequest, isLoading] = useApi(getPostedJobsRequest, {
        onSuccess: (response) => {
            const jobs = response.data.jobs;
            if (jobs.length === 0) {
                snack('No jobs were found', 'warning');
            } else {
                setJobs(jobs);
            }
        },
    });
    React.useEffect(() => sendRequest(), [sendRequest]);

    return isLoading ? (
        <Loader center />
    ) : (
        <JobDashboard
            jobs={jobs}
            setJobs={setJobs}
            title='Posted Jobs'
            reSendRequest={sendRequest}
        />
    );
}

export default JobFacultyMemberDashBoard;
