import React from 'react';
import Grid from '@material-ui/core/Grid';

import { AuthContext } from 'Contexts/AuthContext';
import JobPreview from 'Domains/Jobs/JobPreview';
import JobSummary from 'Domains/Jobs/JobSummary';
import { IJob } from 'Domains/Jobs/api';

interface JobResultsProps {
    jobs: IJob[];
}

function JobResults({ jobs }: JobResultsProps) {
    const { user } = React.useContext(AuthContext);
    const [jobSelectedIndex, setJobSelectedIndex] = React.useState(0);

    const hasPermission = (job: IJob) =>
        user?.role === 'facultyMember' &&
        job.facultyMember.id === user.specificUserId;

    const accessJob = React.useCallback(
        () =>
            jobSelectedIndex < 0 || jobSelectedIndex >= jobs.length
                ? jobs[0]
                : jobs[jobSelectedIndex],
        [jobs, jobSelectedIndex]
    );

    return (
        <Grid container spacing={5} style={{ marginTop: 20 }}>
            <Grid container item direction='column' spacing={3} xs={5}>
                {jobs.map((job, index) => (
                    <Grid item key={index}>
                        <JobPreview
                            job={job}
                            onClick={() => setJobSelectedIndex(index)}
                            isSelected={job.id === accessJob().id}
                            hasPermission={hasPermission(job)}
                        />
                    </Grid>
                ))}
            </Grid>
            <Grid item xs={7}>
                <JobSummary
                    job={accessJob()}
                    hasPermission={hasPermission(accessJob())}
                />
            </Grid>
        </Grid>
    );
}

export default JobResults;
