import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import MessageIcon from '@material-ui/icons/Message';
import { Link } from 'react-router-dom';

interface MessageButtonProps {
    email: string;
}

function MessageButton({ email }: MessageButtonProps) {
    return (
        <IconButton color='secondary' component={Link} to={`/message/${email}`}>
            {<MessageIcon />}
        </IconButton>
    );
}

export default MessageButton;
