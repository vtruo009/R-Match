import React from 'react';
import Button, { ButtonProps } from '@material-ui/core/Button';

interface Props {
    onClick: () => void;
}

function CancelButton({ onClick, ...passThroughProps }: Props & ButtonProps) {
    return (
        <Button
            {...passThroughProps}
            color='secondary'
            variant='contained'
            onClick={onClick}
        >
            Cancel
        </Button>
    );
}

export default CancelButton;
