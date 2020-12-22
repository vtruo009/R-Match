import React from 'react';
import Button from '@material-ui/core/Button';

interface Props {
    onClick: () => void;
}

function CancelButton({ onClick }: Props) {
    return (
        <Button color='secondary' variant='contained' onClick={onClick}>
            Cancel
        </Button>
    );
}

export default CancelButton;
