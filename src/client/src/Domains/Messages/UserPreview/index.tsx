import React from 'react';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { IUser } from 'Domains/Accounts/api/api';

interface Props {
    user: IUser;
    onClick: (user: IUser) => void;
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

function UserPreview({ user, onClick, isSelected }: Props) {
    const classes = useStyles();
    return (
        <Card
            className={isSelected ? classes.Selected : classes.NonSelected}
            variant='outlined'
            style={{ padding: 30 }}
            onClick={() => onClick(user)}
        >
            <Grid container spacing={4} alignItems='center' justify='center'>
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
                            {user.firstName} {user.lastName}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
        </Card>
    );
}

export default UserPreview;
