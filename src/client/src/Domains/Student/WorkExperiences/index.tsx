import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';

import Card from 'Components/Card';
import WorkExperience from '../WorkExperience';
import WorkExperienceCreateForm from '../WorkExperienceCreateForm';
import JobIcon from 'Domains/Jobs/JobIcon';
import { IWorkExperience } from '../api';

interface WorkExperiencesProps {
    workExperiences: IWorkExperience[];
    hasPermission: boolean;
}

function WorkExperiences({
    workExperiences,
    hasPermission,
}: WorkExperiencesProps) {
    return (
        <div>
            <Card>
                <Grid container spacing={3}>
                    <Grid item container justify='space-between'>
                        <Typography variant='h5' color='primary'>
                            Work Experiences{' '}
                            <JobIcon numberOfJobs={workExperiences.length} />
                        </Typography>
                        {hasPermission && <WorkExperienceCreateForm />}
                    </Grid>
                    <Grid item container spacing={3}>
                        {workExperiences.map((workExperience, index) => (
                            <Grid item key={index} xs={12}>
                                {index ? (
                                    <Divider style={{ marginBottom: 20 }} />
                                ) : (
                                    <> </>
                                )}
                                <WorkExperience
                                    workExperience={workExperience}
                                    hasPermission={hasPermission}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </Card>
        </div>
    );
}

export default WorkExperiences;
