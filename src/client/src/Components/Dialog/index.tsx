import React from 'react';
import MUIDialog from '@material-ui/core/Dialog';
import MUIDialogActions from '@material-ui/core/DialogActions';
import MUIDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

interface Props {
    children: JSX.Element;
    open: boolean;
    onClose: () => void;
    title: string;  
}

function Dialog({ children, open, onClose }: Props) {
    return (
        <MUIDialog open={open} onClose={onClose} maxWidth='md' fullWidth>
            <MUIDialogTitle>Phone Ringtone</MUIDialogTitle>
            <MUIDialogActions>
                <IconButton onClick={onClose} color='secondary'>
                    <CloseIcon />
                </IconButton>
            </MUIDialogActions>
            {children}
        </MUIDialog>
    );
}

export default Dialog;
