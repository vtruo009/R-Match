import React from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { IJob } from '../api/api';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

interface Props {
    job: IJob;
    onClick: (job: IJob) => void;
    isSelected: boolean;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        Box: {
            '&:hover': { backgroundColor: '#efefef' },
        },
        Selected: {
            backgroundColor: '#efefef',
        },
    })
);

function JobPreview({ job, onClick, isSelected }: Props) {
    const classes = useStyles();
    return (
        <Box
            className={isSelected ? classes.Selected : classes.Box}
            style={{ padding: 30 }}
            borderRadius={16}
            border={1}
            borderColor='#b2bec3'
            onClick={() => onClick(job)}
        >
            <Grid container spacing={4} alignItems='center'>
                <Grid item md={3} xs={12}>
                    TODO: Add Icon
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
                            {job.hoursPerWeek} hr/week, ${job.minSalary}
                            {job.maxSalary && <> - ${job.maxSalary} </>}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant='body1'>Van Truong</Typography>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
}

export default JobPreview;
