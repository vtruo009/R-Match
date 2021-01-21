import React from 'react';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AssistantIcon from '@material-ui/icons/AssistantPhoto';
import GraderIcon from '@material-ui/icons/Assignment';
import ResearchIcon from '@material-ui/icons/FindInPage';
import TutorIcon from '@material-ui/icons/SupervisedUserCircle';
import VolunteerIcon from '@material-ui/icons/Accessibility';
import OtherIcon from '@material-ui/icons/AddCircle';

import Salary from 'Domains/Jobs/Salary';
import { IJob, jobType } from 'Domains/Jobs/api';

interface JobPreviewProps {
    job: IJob;
    onClick: (job: IJob) => void;
    isSelected: boolean;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        NonSelected: {
            '&:hover': { backgroundColor: '#efefef' },
        },
        Selected: {
            backgroundColor: '#efefef',
            borderColor: theme.palette.primary.main,
        },
    })
);

const getIcon = (type: jobType): JSX.Element => {
    const color = 'primary';
    const fontSize = 60;
    switch (type) {
        case 'assistant':
            return <AssistantIcon style={{ fontSize }} color={color} />;
        case 'grader':
            return <GraderIcon style={{ fontSize }} color={color} />;
        case 'researcher':
            return <ResearchIcon style={{ fontSize }} color={color} />;
        case 'tutor':
            return <TutorIcon style={{ fontSize }} color={color} />;
        case 'volunteer':
            return <VolunteerIcon style={{ fontSize }} color={color} />;
        default:
            return <OtherIcon style={{ fontSize }} color={color} />;
    }
};

function JobPreview({ job, onClick, isSelected }: JobPreviewProps) {
    const classes = useStyles();
    return (
        <Card
            className={isSelected ? classes.Selected : classes.NonSelected}
            variant='outlined'
            style={{ padding: 30 }}
            onClick={() => onClick(job)}
        >
            <Grid container spacing={4} alignItems='center' justify='center'>
                <Grid
                    container
                    item
                    md={3}
                    xs={12}
                    justify='center'
                    alignItems='center'
                >
                    {getIcon(job.type[0])}
                </Grid>
                <Grid
                    item
                    container
                    direction='column'
                    spacing={1}
                    md={9}
                    xs={12}
                >
                    <Grid item>
                        <Typography variant='h6' color='primary'>
                            {job.title}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant='body1'>
                            Hours per week: {job.hoursPerWeek}
                        </Typography>
                    </Grid>
                    {job.minSalary > 0 && (
                        <Grid item>
                            Hourly wage:
                            <Salary
                                minSalary={job.minSalary}
                                maxSalary={job.maxSalary}
                            />
                        </Grid>
                    )}
                    <Grid item>
                        <Typography variant='body1'>
                            Posted by:{' '}
                            {job.facultyMember.title && job.facultyMember.title}{' '}
                            {job.facultyMember.user.firstName}{' '}
                            {job.facultyMember.user.lastName}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
        </Card>
    );
}

export default JobPreview;
