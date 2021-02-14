import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Carousel from 'react-material-ui-carousel';

import useDialog from 'hooks/useDialog';
import JobPreview from 'Domains/Jobs/JobPreview';
import JobSummary from 'Domains/Jobs/JobSummary';
import JobIcon from 'Domains/Jobs/JobIcon';
import { IJob } from '../api';

interface JobResultsHorizontalProps {
    jobs: IJob[];
    title: string;
}

function JobResultsHorizontal({ jobs, title }: JobResultsHorizontalProps) {
    const { openDialog, DialogProps, Dialog } = useDialog();
    const [selectedJob, setSelectedJob] = React.useState<IJob>();
    const numberOfJobsPerSection = 3;
    const createJobSections = React.useCallback(() => {
        const jobSections = [];
        for (
            let index = 0;
            index < jobs.length;
            index += numberOfJobsPerSection
        ) {
            jobSections.push(jobs.slice(index, index + numberOfJobsPerSection));
        }
        return jobSections;
    }, [jobs]);

    return jobs.length > 0 ? (
        <Grid container spacing={4}>
            <Grid item>
                <Typography variant='h4' color='primary'>
                    {title} <JobIcon numberOfJobs={jobs.length} />{' '}
                </Typography>
            </Grid>
            <Grid item>
                <Carousel>
                    {createJobSections().map((jobSection) => (
                        <Grid container justify='center' spacing={1}>
                            {jobSection.map((job, index) => (
                                <Grid item xs={12} md={4} key={index}>
                                    <JobPreview
                                        job={job}
                                        hasPermission={false}
                                        isSelected={job.id === selectedJob?.id}
                                        onClick={() => {
                                            setSelectedJob(job);
                                            openDialog();
                                        }}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    ))}
                </Carousel>
            </Grid>
            {selectedJob && (
                <Dialog {...DialogProps} title='Job Information'>
                    <JobSummary job={selectedJob} hasPermission={false} />
                </Dialog>
            )}
        </Grid>
    ) : (
        <> </>
    );
}

export default JobResultsHorizontal;
