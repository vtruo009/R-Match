import React from 'react';
import Grid from '@material-ui/core/Grid';

import JobPreview from 'Domains/Jobs/JobPreview';
import JobSummary from 'Domains/Jobs/JobSummary';
import { IJob } from 'Domains/Jobs/api';

interface JobResultsProps {
    jobs: IJob[];
}

function JobResults({ jobs }: JobResultsProps) {
    const [jobSelected, setJobSelected] = React.useState<IJob>(jobs[0]);
    // Resets job selected to first job after new jobs are fetched
    React.useEffect(() => {
        setJobSelected(jobs[0]);
    }, [jobs]);
    return (
        <Grid container spacing={5} style={{ marginTop: 20 }}>
            {/* Render all jobs */}
            <Grid container item direction='column' spacing={3} xs={5}>
                {jobs.map((job, index) => (
                    <Grid item key={index}>
                        <JobPreview
                            job={job}
                            onClick={setJobSelected}
                            isSelected={job.id === jobSelected.id}
                        />
                    </Grid>
                ))}
            </Grid>
            <Grid item xs={7}>
                <JobSummary job={jobSelected} />
            </Grid>
        </Grid>
    );
}

export default JobResults;
