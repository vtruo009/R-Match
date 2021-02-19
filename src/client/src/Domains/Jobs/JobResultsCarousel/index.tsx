import React from 'react';
import { AxiosResponse } from 'axios';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Carousel from 'react-material-ui-carousel';

import useApi from 'hooks/useApi';
import useDialog from 'hooks/useDialog';
import JobPreview from 'Domains/Jobs/JobPreview';
import JobSummary from 'Domains/Jobs/JobSummary';
import JobIcon from 'Domains/Jobs/JobIcon';
import JobsContext, { defaultJobStateHandlers } from '../Contexts/JobsContext';

import { IJob } from '../api';

interface JobResultsHorizontalProps {
    title: string;
    request: () => Promise<AxiosResponse<{ jobs: IJob[] }>>;
}

function JobResultsHorizontal({ title, request }: JobResultsHorizontalProps) {
    const [jobs, setJobs] = React.useState<IJob[]>([]);
    const [sendRequest] = useApi(request, {
        onSuccess: (response) => {
            setJobs(response.data.jobs);
        },
    });
    const removeJob = (jobToRemoveId: number) =>
        setJobs(jobs.filter((job) => job.id !== jobToRemoveId));

    React.useEffect(() => sendRequest(), [sendRequest]);
    const { openDialog, DialogProps, Dialog, closeDialog } = useDialog();
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
                    {title} <JobIcon numberOfJobs={jobs.length} />
                </Typography>
            </Grid>
            <Grid item>
                <JobsContext.Provider
                    value={{
                        ...defaultJobStateHandlers,
                        removeJob,
                        onApply: closeDialog,
                    }}
                >
                    <Carousel>
                        {createJobSections().map((jobSection) => (
                            <Grid container justify='center' spacing={1}>
                                {jobSection.map((job, index) => (
                                    <Grid item xs={12} md={4} key={index}>
                                        <JobPreview
                                            job={job}
                                            hasPermission={false}
                                            isSelected={
                                                job.id === selectedJob?.id
                                            }
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
                    {selectedJob && (
                        <Dialog {...DialogProps} title='Job Information'>
                            <JobSummary
                                job={selectedJob}
                                hasPermission={false}
                            />
                        </Dialog>
                    )}
                </JobsContext.Provider>
            </Grid>
        </Grid>
    ) : (
        <> </>
    );
}

export default JobResultsHorizontal;
