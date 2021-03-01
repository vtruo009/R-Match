import React from 'react';

import useSnack from 'hooks/useSnack';
import useApi from 'hooks/useApi';
import usePagination from 'hooks/usePagination';
import Loader from 'Components/Loader';
import { getAppliedJobs, IJob } from '../api/index';
import JobDashboard from 'Domains/Jobs/JobDashboard';

const numOfItems = 7;
function JobStudentDashBoard() {
    const [jobs, setJobs] = React.useState<IJob[]>([]);
    const [snack] = useSnack();
    const {
        page,
        setNumOfPages,
        PaginationProps,
        Pagination,
    } = usePagination();
    const getPostedJobsRequest = React.useCallback(
        () => getAppliedJobs(page, numOfItems),
        [page]
    );
    const [sendRequest, isLoading] = useApi(getPostedJobsRequest, {
        onSuccess: (response) => {
            const { jobApplications, jobApplicationsCount } = response.data;
            if (jobApplications.length === 0) {
                snack('No job applications were found', 'warning');
            } else {
                const jobs = jobApplications.map((jobApp) => jobApp.job);
                setJobs(jobs);
                setNumOfPages(Math.ceil(jobApplicationsCount / numOfItems));
            }
        },
    });
    React.useEffect(() => sendRequest(), [sendRequest]);
    return isLoading ? (
        <Loader centerPage />
    ) : (
        <div>
            <JobDashboard
                title='Applied Jobs'
                jobs={jobs}
                setJobs={setJobs}
                reSendRequest={sendRequest}
            />
            <Pagination {...PaginationProps} onPageChange={sendRequest} />
        </div>
    );
}

export default JobStudentDashBoard;
