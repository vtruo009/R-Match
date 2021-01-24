import React from 'react';
import { AxiosResponse } from 'axios';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import TrashCanIcon from '@material-ui/icons/Delete';

import useApi from 'hooks/useApi';
import useSnack from 'hooks/useSnack';
import Button from 'Components/Button';
import Dialog from 'Components/Dialog';
import CancelButton from 'Components/CancelButton';

interface DeleteWarningProps {
    message: string;
    onDeleteRequest: () => Promise<AxiosResponse<unknown>>;
    onSuccess: () => void;
}

function DeleteButton({
    message,
    onDeleteRequest,
    onSuccess,
}: DeleteWarningProps) {
    const [open, setOpen] = React.useState(false);
    const [snack] = useSnack();
    const [sendDeleteRequest, isLoading] = useApi(onDeleteRequest, {
        onSuccess: () => {
            setOpen(false);
            onSuccess();
            snack('Item successfully deleted', 'success');
        },
    });
    return (
        <div>
            <IconButton onClick={() => setOpen(true)} color='secondary'>
                {<TrashCanIcon />}
            </IconButton>
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                title={
                    <Typography variant='h3' color='secondary'>
                        Warning:
                    </Typography>
                }
            >
                <div>
                    <Typography variant='h6'>
                        <b>{message}</b>
                    </Typography>
                    <DialogActions>
                        <CancelButton
                            onClick={() => setOpen(false)}
                            disabled={isLoading}
                        />
                        <Button
                            disabled={isLoading}
                            color='secondary'
                            onClick={sendDeleteRequest}
                        >
                            Confirm
                        </Button>
                    </DialogActions>
                </div>
            </Dialog>
        </div>
    );
}

export default DeleteButton;
