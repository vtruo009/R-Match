import React from 'react';
import MUIButton, { ButtonProps } from '@material-ui/core/Button';

function Button({
    color = 'primary',
    variant = 'contained',
    ...passThroughProps
}: ButtonProps) {
    return <MUIButton {...passThroughProps} variant={variant} color={color} />;
}

export default Button;
