import React from 'react';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { AuthContext } from 'Contexts/AuthContext';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { IMessage } from 'Domains/Messages/api/api';
import { formatDateString } from 'utils/format';

interface Props {
    message: IMessage;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        SentByUser: {
            backgroundColor: '#efefef',
        },
        SentByOther: {
            backgroundColor: 'primary',
            color: '#ffffff'
        },
    })
);

const getDateString = (dateString: string): string => {
    const date = new Date(dateString);

    const dateNow = new Date();

    // If same date, return time.
    if (date.getMonth() === dateNow.getMonth()
        && date.getDate() === dateNow.getDate()
        && date.getFullYear() === dateNow.getFullYear()) {
        var hour = date.getHours();
        var abbreviation = 'am';
        if (hour >= 12) {
            if (hour > 12) hour -= 12;
            abbreviation = 'pm';
        }
        return `${hour}:${date.getMinutes().toString().padStart(2, '0')} ${abbreviation}`;
    }

    // If same year, return only month and date.
    if (date.getFullYear() === dateNow.getFullYear())
        return `${date.getMonth() + 1}/${date.getDate()}`;

    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
};

function MessageDialog({ message }: Props) {
    const classes = useStyles();
    const { user } = React.useContext(AuthContext);
    const userId = user?.userId;

    return (
        <Grid item>
            <Grid item>
                <Typography color='primary'>
                    {message.sender.firstName} ({getDateString(message.date)})
                </Typography>
            </Grid>
            <Card
                className={message.sender.id === userId ? classes.SentByUser : classes.SentByOther}
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
                            <Typography color='primary'>
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
