import React from 'react';

import useSnack from 'hooks/useSnack';
import useApi from 'hooks/useApi';
import Loader from 'Components/Loader';
import { getAppliedJobs, IJob } from '../api/index';
import JobDashboard from 'Domains/Jobs/JobDashboard';

function JobStudentDashBaord() {
    const [jobs, setJobs] = React.useState<IJob[]>([]);
    const [snack] = useSnack();
    const getPostedJobsRequest = React.useCallback(() => getAppliedJobs(), []);
    const [sendRequest, isLoading] = useApi(getPostedJobsRequest, {
        onSuccess: (response) => {
            const jobApps = response.data.jobApplications;
            if (jobs.length === 0) {
                snack('No job applications were found', 'warning');
            } else {
                const jobs = jobApps.map((jobApp) => jobApp.job);
                setJobs(jobs);
            }
        },
    });
    React.useEffect(() => sendRequest(), [sendRequest]);
    return isLoading ? (
        <Loader center />
    ) : (
        <JobDashboard
            title='Applied Jobs'
            jobs={jobs}
            setJobs={setJobs}
            reSendRequest={sendRequest}
        />
    );
}

export default JobStudentDashBaord;
