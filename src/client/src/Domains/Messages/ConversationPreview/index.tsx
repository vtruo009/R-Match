import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import Card from 'Components/Card';
import { formatDateStringBasedOnCurrentDay, shortenString } from 'utils/format';
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

function ConversationPreview({
    conversation,
    onClick,
    isSelected,
}: ConversationPreviewProps) {
    const classes = useStyles();
    return (
        <Card
            className={isSelected ? classes.Selected : classes.NonSelected}
            onClick={() => onClick(conversation.user)}
        >
            <Grid container spacing={2} alignItems='center' justify='center'>
                <Grid item xs={12}>
                    <Typography variant='h6' color='primary'>
                        {conversation.user.firstName}{' '}
                        {conversation.user.lastName}
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography color='primary'>
                        {conversation.latestMessage.sender.firstName} (
                        {formatDateStringBasedOnCurrentDay(
                            conversation.latestMessage.date
                        )}
                        ):
                        {shortenString(conversation.latestMessage.content, 13)}
                    </Typography>
                </Grid>
            </Grid>
        </Card>
    );
}

export default ConversationPreview;
