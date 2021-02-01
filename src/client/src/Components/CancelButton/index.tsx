import React from 'react';
import Button, { ButtonProps } from '@material-ui/core/Button';

interface CancelButtonProps {
    onClick: () => void;
}

function CancelButton({
    onClick,
    ...passThroughProps
}: CancelButtonProps & ButtonProps) {
    return (
        <Button {...passThroughProps} variant='contained' onClick={onClick}>
            Cancel
        </Button>
    );
}

export default CancelButton;
