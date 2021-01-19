import React from 'react';
import IconButton, { IconButtonProps } from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';

// import useDialog from 'hooks/useDialog';
// import Dialog from 'Components/Dialog';

function EditButton(props: IconButtonProps) {
    // const [open, setOpen] = React.useState(false);

    return (
        <>
            <IconButton {...props} color='primary'>
                {<EditIcon />}
            </IconButton>
        </>
    );
}

export default EditButton;
