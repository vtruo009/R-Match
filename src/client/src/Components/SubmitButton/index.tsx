import React from 'react';
import Loader from 'Components/Loader';
import MUIButton, { ButtonProps } from '@material-ui/core/Button';

interface SubmitButtonProps {
    isLoading: boolean;
    size?: 'small' | 'medium' | 'large';
    label?: string;
}

function SubmitButton({
    isLoading,
    disabled = false,
    size = 'large',
    label = 'Submit',
    ...passThroughProps
}: ButtonProps & SubmitButtonProps) {
    return (
        <MUIButton
            {...passThroughProps}
            type='submit'
            disabled={isLoading || disabled}
            variant='contained'
            color='primary'
            size={size}
        >
            {label}
            {isLoading && <Loader size={20} style={{ marginLeft: 5   }} />}
        </MUIButton>
    );
}

export default SubmitButton;
