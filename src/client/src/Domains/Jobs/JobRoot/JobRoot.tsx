import React from 'react';
import JobResults from '../JobResults/JobResults';
import { getJobs, IJob } from '../api/api';

function JobRoot() {
    const [jobsFetched, setJobsFetched] = React.useState<IJob[]>([]);
    const fetchJobs = async () => {
        try {
            const response = await getJobs();
            setJobsFetched(response.data.jobs);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <button onClick={() => fetchJobs()}>Search</button>
            {jobsFetched && <JobResults jobs={jobsFetched}></JobResults>}
        </div>
    );
}

export default JobRoot;