import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import MUIDialog from '@material-ui/core/Dialog';
import MUIDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

interface DialogProps {
    children: JSX.Element;
    open: boolean;
    onClose?: () => void;
    title: string;
}

function Dialog({ children, open, onClose, title }: DialogProps) {
    return (
        <MUIDialog open={open} onClose={onClose} maxWidth='md' fullWidth>
            <MUIDialogTitle style={{ padding: 40 }}>
                <Grid container justify='space-between' alignItems='center'>
                    <Grid item>
                        <Typography variant='h4'>{title}</Typography>
                    </Grid>
                    <Grid item>
                        {onClose ? (
                            <IconButton color='secondary' onClick={onClose}>
                                <CloseIcon />
                            </IconButton>
                        ) : null}
                    </Grid>
                </Grid>
            </MUIDialogTitle>
            {children}
        </MUIDialog>
    );
}

export default Dialog;
