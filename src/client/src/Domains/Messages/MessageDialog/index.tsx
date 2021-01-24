import React from 'react';

import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import { AuthContext } from 'Contexts/AuthContext';
import { IMessage } from 'Domains/Messages/api';
import { formatDateStringBasedOnCurrentDay } from 'utils/format';

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

function MessageDialog({ message }: Props) {
    const classes = useStyles();

    const { user } = React.useContext(AuthContext);
    const userId = user?.userId;

    return (
        <Grid item>
            <Grid item>
                <Typography color='primary'>
                    {message.sender.firstName} {message.sender.lastName} (
                    {formatDateStringBasedOnCurrentDay(message.date)})
                </Typography>
            </Grid>
            <Card
                className={
                    message.sender.id === userId
                        ? classes.SentByUser
                        : classes.SentByReceiver
                }
                variant='outlined'
                style={{ padding: 10 }}
            >
                <Grid
                    container
                    spacing={4}
                    alignItems='center'
                    justify='center'
                >
                    <Grid
                        item
                        container
                        direction='column'
                        spacing={1}
                        md={9}
                        xs={12}
                    >
                        <Typography>{message.content}</Typography>
                    </Grid>
                </Grid>
            </Card>
        </Grid>
    );
}

export default MessageDialog;
