import React from 'react';

import useApi from 'hooks/useApi';
import useSnack from 'hooks/useSnack';
import { IJob, getPostedJobs } from '../api/index';
import JobDashboard from 'Domains/Jobs/JobDashboard';
import usePagination from 'hooks/usePagination';
import Loader from 'Components/Loader';

const numOfItems = 7;
function JobFacultyMemberDashBoard() {
    const [jobs, setJobs] = React.useState<IJob[]>([]);
    const [snack] = useSnack();
    const {
        page,
        setNumOfPages,
        PaginationProps,
        Pagination,
    } = usePagination();
    const getPostedJobsRequest = React.useCallback(
        () => getPostedJobs(page, numOfItems),
        [page]
    );
    const [sendRequest, isLoading] = useApi(getPostedJobsRequest, {
        onSuccess: (response) => {
            const { jobs, jobsCount } = response.data;

            if (jobs.length === 0) {
                snack('No jobs were found', 'warning');
            } else {
                setJobs(jobs);
                setNumOfPages(Math.ceil(jobsCount / numOfItems));
            }
        },
    });

    React.useEffect(() => sendRequest(), [sendRequest]);

    if (isLoading) return <Loader centerPage />;

    return (
        <div>
            <JobDashboard
                jobs={jobs}
                setJobs={setJobs}
                title='Posted Jobs'
                reSendRequest={sendRequest}
            />
            <Pagination {...PaginationProps} onPageChange={sendRequest} />
        </div>
    );
}

export default JobFacultyMemberDashBoard;
