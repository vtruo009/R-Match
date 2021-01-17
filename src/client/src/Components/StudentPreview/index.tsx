import React from 'react';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { IStudent } from 'Domains/Student/api';
// import { Container } from '@material-ui/core';

interface Props {
    student: IStudent;
    //onClick: (student: IStudent) => void;
    //isSelected: boolean;
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

// maybe get a student icon but theyre all the same so should we?

// function StudentPreview ({ student, onClick, isSelected }: Props) {
function StudentPreview ({ student }: Props) {
    //const classes = useStyles();
    return (
        <Card
            //className={isSelected ? classes.Selected : classes.NonSelected}
            variant='outlined'
            style={{ padding: 30 }}
            //onClick={() => onClick(student)}
        >
            <Grid container spacing={4} alignItems='center' justify='center'>
                <Grid container item md={3} xs={3} justify='center' alignItems='center'>
                    {/* icon */}
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
                            {`${student.user.firstName} ${student.user.lastName}`}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant='body1'>
                            Year: {student.classStanding}
                        </Typography>
                    </Grid>
                </Grid>

            </Grid>
        </Card>
    );
}

export default StudentPreview;