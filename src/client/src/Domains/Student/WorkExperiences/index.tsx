import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';

import Card from 'Components/Card';
import WorkExperience from '../WorkExperience';
import { IWorkExperience } from '../api';

interface WorkExperiencesProps {
    workExperiences: IWorkExperience[];
}

function WorkExperiences({ workExperiences }: WorkExperiencesProps) {
    return (
        <Card>
            <Grid container spacing={3}>
                <Grid item container justify='space-between'>
                    <Typography variant='h5' color='primary'>
                        Work Experiences
                    </Typography>
                    <IconButton color='primary'>
                        <AddIcon />
                    </IconButton>
                </Grid>
                <Grid item container spacing={3}>
                    {workExperiences.map((workExperience, index) => (
                        <Grid item key={index} xs={12}>
                            {index ? (
                                <Divider style={{ marginBottom: 20 }} />
                            ) : (
                                <> </>
                            )}
                            <WorkExperience workExperience={workExperience} />
                        </Grid>
                    ))}
                </Grid>
            </Grid>
        </Card>
    );
}

export default WorkExperiences;
