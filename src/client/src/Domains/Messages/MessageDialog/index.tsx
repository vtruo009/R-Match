import React from 'react';

import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import { AuthContext } from 'Contexts/AuthContext';
import { IMessage } from 'Domains/Messages/api';

interface Props {
    message: IMessage;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        SentByUser: {
            backgroundColor: '#E8ECF5',
            color: '#3F51B5',
        },
        SentByReceiver: {
            backgroundColor: '#3F51B5',
            color: 'white',
        },
    })
);

// Convert dateString to a readable formatting.
const getDateString = (dateString: string): string => {
    const requestedDate = new Date(dateString);
    const dateNow = new Date();

    // If the requested date is today, return time.
    if (requestedDate.getMonth() === dateNow.getMonth()
        && requestedDate.getDate() === dateNow.getDate()
        && requestedDate.getFullYear() === dateNow.getFullYear()) {
        var hour = requestedDate.getHours();
        var abbreviation = 'am';
        if (hour >= 12) {
            if (hour > 12) hour -= 12;
            abbreviation = 'pm';
        }
        return `${hour}:${requestedDate.getMinutes().toString().padStart(2, '0')} ${abbreviation}`;
    }

    // If the requested date is the same year, return only month and date.
    if (requestedDate.getFullYear() === dateNow.getFullYear())
        return `${requestedDate.getMonth() + 1}/${requestedDate.getDate()}`;


    // Else, return month, date, and year.
    return `${requestedDate.getMonth() + 1}/${requestedDate.getDate()}/${requestedDate.getFullYear()}`;
};

function MessageDialog({ message }: Props) {
    const classes = useStyles();

    const { user } = React.useContext(AuthContext);
    const userId = user?.userId;

    return (
        <Grid item>
            <Grid item>
                <Typography color='primary'>
                    {message.sender.firstName} {message.sender.lastName} ({getDateString(message.date)})
                </Typography>
            </Grid>
            <Card
                className={message.sender.id === userId ? classes.SentByUser : classes.SentByReceiver}
                variant='outlined'
                style={{ padding: 10 }}
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
                            <Typography>
                                {message.message}
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Card>
        </Grid>
    );
}

export default MessageDialog;
