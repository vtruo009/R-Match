import React from 'react';

import useApi from 'hooks/useApi';
import Loader from 'Components/Loader';
import { getAppliedJobs, IJob } from '../api/index';
import JobDashboard from 'Domains/Jobs/JobDashboard';

function JobStudentDashBaord() {
    const [jobs, setJobs] = React.useState<IJob[]>([]);
    const getPostedJobsRequest = React.useCallback(() => getAppliedJobs(), []);
    const [sendRequest, isLoading] = useApi(getPostedJobsRequest, {
        onSuccess: (response) => {
            const jobApps = response.data.jobApplications;
            const jobs = jobApps.map((jobApp) => jobApp.job);
            setJobs(jobs);
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
