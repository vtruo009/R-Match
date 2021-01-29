import React from 'react';
import MUIButton, { ButtonProps } from '@material-ui/core/Button';

function Button({
    color = 'primary',
    variant = 'contained',
    ...passThroughProps
}: ButtonProps) {
    return <MUIButton variant={variant} color={color} {...passThroughProps} />;
}

export default Button;
