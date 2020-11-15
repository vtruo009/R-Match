import React from 'react';
import { IJob } from '../api/api';
import Grid from '@material-ui/core/Grid';
import JobPreview from '../JobPreview/JobPreview';
import JobSummary from '../JobSummary/JobSummary';

interface Props {
    jobs: IJob[];
}

function JobResults({ jobs }: Props) {
    const [jobSelected, setJobSelected] = React.useState<IJob>(jobs[0]);
    return (
        <Grid container spacing={3} style={{ marginTop: 20 }}>
            <Grid item xs={5}>
                {/* Render all jobs */}
                <Grid container spacing={3} direction='column'>
                    {jobs.map((job, key) => (
                        <Grid item key={key}>
                            <JobPreview
                                job={job}
                                onClick={setJobSelected}
                                isSelected={job.jobId === jobSelected.jobId}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Grid>
            <Grid item xs={7}>
                <JobSummary job={jobSelected} />
            </Grid>
        </Grid>
    );
}

export default JobResults;
