import React from 'react';
import IconButton, { IconButtonProps } from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';

function EditButton(props: IconButtonProps) {
    return (
        <>
            <IconButton {...props}>{<EditIcon color='primary' />}</IconButton>
        </>
    );
}

export default EditButton;
