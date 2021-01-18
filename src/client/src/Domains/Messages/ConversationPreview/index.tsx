import React from 'react';

import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import { IUser } from 'Domains/Accounts/api/api';
import { IConversation } from 'Domains/Messages/api/api';

interface Props {
    conversation: IConversation;
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

function ConversationPreview({ conversation, onClick, isSelected }: Props) {
    const classes = useStyles();
    return (
        <Card
            className={isSelected ? classes.Selected : classes.NonSelected}
            variant='outlined'
            style={{ padding: 30 }}
            onClick={() => onClick(conversation.user)}
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
                            {conversation.user.firstName} {conversation.user.lastName}
                        </Typography>
                        <Typography color='primary'>
                            {conversation.latestMessage.sender.firstName} ({getDateString(conversation.latestMessage.date)}): {conversation.latestMessage.message}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
        </Card>
    );
}

export default ConversationPreview;
