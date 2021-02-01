import React from 'react';

import JobsContext, {
    defaultJobStateHandlers,
} from 'Domains/Jobs/Contexts/JobsContext';
import JobResults from 'Domains/Jobs/JobResults';
import JobSearchForm from 'Domains/Jobs/JobSearchForm';
import { IJob } from 'Domains/Jobs/api';

function JobRoot() {
    const [jobsFetched, setJobsFetched] = React.useState<IJob[]>([]);

    const removeJob = (jobToRemoveId: number) => {
        const jobsFiltered = jobsFetched.filter(
            (job) => job.id !== jobToRemoveId
        );
        setJobsFetched(jobsFiltered);
    };

    return (
        <JobSearchForm
            children={
                <div>
                    {jobsFetched.length > 0 && (
                        <JobsContext.Provider
                            value={{ ...defaultJobStateHandlers, removeJob }}
                        >
                            <JobResults jobs={jobsFetched}></JobResults>
                        </JobsContext.Provider>
                    )}
                </div>
            }
            setJobs={setJobsFetched}
        />
    );
}
export default JobRoot;
