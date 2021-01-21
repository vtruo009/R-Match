import React from 'react';

import JobResults from 'Domains/Jobs/JobResults';
import JobSearchForm from 'Domains/Jobs/JobSearchForm';
import { IJob } from 'Domains/Jobs/api';

function JobRoot() {
    const [jobsFetched, setJobsFetched] = React.useState<IJob[]>([]);
    return (
        <JobSearchForm
            children={
                <div>
                    {jobsFetched.length > 0 && (
                        <JobResults jobs={jobsFetched}></JobResults>
                    )}
                </div>
            }
            setJobs={setJobsFetched}
        />
    );
}
export default JobRoot;
