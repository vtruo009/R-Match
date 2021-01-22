import React from 'react';

import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import { formatDateStringBasedOnCurrentDay } from 'utils/format';
import { IUser } from 'Domains/Accounts/api';
import { IConversation } from 'Domains/Messages/api';

interface ConversationPreviewProps {
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

function ConversationPreview({ conversation, onClick, isSelected }: ConversationPreviewProps) {
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
                            {conversation.latestMessage.sender.firstName} ({formatDateStringBasedOnCurrentDay(conversation.latestMessage.date)}): {conversation.latestMessage.content}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
        </Card>
    );
}

export default ConversationPreview;