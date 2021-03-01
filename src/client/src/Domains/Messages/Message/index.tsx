import React from 'react';
import Typography from '@material-ui/core/Typography';
import { createStyles, makeStyles } from '@material-ui/core/styles';

import Card from 'Components/Card';
import { AuthContext } from 'Contexts/AuthContext';
import { IMessage } from 'Domains/Messages/api';
import { formatDateStringBasedOnCurrentDay } from 'utils/format';

interface MessageProps {
    message: IMessage;
}

const useStyles = makeStyles(() =>
    createStyles({
        SentByUser: {
            backgroundColor: '#E8ECF5',
            color: '#3F51B5',
            borderRadius: '10%',
            float: 'left',
        },
        SentByReceiver: {
            backgroundColor: '#3F51B5',
            color: 'white',
            float: 'right',
        },
    })
);

function Message({ message }: MessageProps) {
    const classes = useStyles();
    const { user } = React.useContext(AuthContext);
    const userId = user?.userId;

    return (
        <Card
            className={
                message.sender.id === userId
                    ? classes.SentByUser
                    : classes.SentByReceiver
            }
            style={{ padding: 10, borderRadius: 15 }}
        >
            <Typography>
                {message.sender.firstName} {message.sender.lastName} (
                {formatDateStringBasedOnCurrentDay(message.date)})
            </Typography>
            <Typography>{message.content}</Typography>
        </Card>
    );
}

export default Message;
