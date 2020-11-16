import React from 'react';
import JobResults from '../JobResults/JobResults';
import Loader from '../../../Components/Loader/Loader';
import useApi from '../../../hooks/useApi';
import useSnack from '../../../hooks/useSnack';
import { getJobs, IJob } from '../api/api';

import Button from '@material-ui/core/Button';

function JobRoot() {
    const [jobsFetched, setJobsFetched] = React.useState<IJob[]>([]);
    const [snack] = useSnack();
    const request = React.useCallback(() => getJobs(), []);

    const [sendRequest, isLoading] = useApi(request, {
        onSuccess: (response) => {
            const jobs = response.data.jobs;
            if (jobs.length === 0) {
                snack('No jobs were found', 'warning');
            } else {
                setJobsFetched(jobs);
            }
        },
    });

    return (
        <div style={{ padding: 20 }}>
            <Button variant='contained' color='primary' onClick={sendRequest}>
                Search
            </Button>
            {isLoading ? (
                <Loader size={55} />
            ) : (
                jobsFetched.length > 0 && (
                    <JobResults jobs={jobsFetched}></JobResults>
                )
            )}
        </div>
    );
}
export default JobRoot;
