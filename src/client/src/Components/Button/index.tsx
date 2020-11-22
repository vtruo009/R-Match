import React from 'react';
import MUIButton, { ButtonProps } from '@material-ui/core/Button';

interface Props {
    isLoading: boolean;
    size?: 'small' | 'medium' | 'large';
}

function Button({
    isLoading,
    children,
    size = 'large',
    ...passThroughProps
}: ButtonProps & Props) {
    return (
        <MUIButton
            {...passThroughProps}
            disabled={isLoading}
            variant='contained'
            color='primary'
            size={size}
        >
            {children}
        </MUIButton>
    );
}

export default Button;
