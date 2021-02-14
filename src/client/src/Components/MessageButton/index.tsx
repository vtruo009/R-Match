import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import MailIcon from '@material-ui/icons/Mail';
import { Link } from 'react-router-dom';

interface MessageButtonProps {
    email: string;
}

function MessageButton({ email }: MessageButtonProps) {
    return (
        <IconButton color='primary' component={Link} to={`/message/${email}`}>
            {<MailIcon />}
        </IconButton>
    );
}

export default MessageButton;