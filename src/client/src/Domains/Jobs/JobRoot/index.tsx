import React from 'react';
import JobResults from 'Domains/Jobs/JobResults';
import JobSearchForm from 'Domains/Jobs/JobSearchForm';
import { IJob } from 'Domains/Jobs/api/api';

function JobRoot() {
    const [jobsFetched, setJobsFetched] = React.useState<IJob[]>([]);

    return (
        <div style={{ padding: 20 }}>
            <JobSearchForm setJobs={setJobsFetched} />
            {jobsFetched.length > 0 && (
                <JobResults jobs={jobsFetched}></JobResults>
            )}
        </div>
    );
}
export default JobRoot;
