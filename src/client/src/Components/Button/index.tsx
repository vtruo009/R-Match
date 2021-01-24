import React from 'react';
import MUIButton, { ButtonProps } from '@material-ui/core/Button';

function Button({ color = 'primary', ...passThroughProps }: ButtonProps) {
    return (
        <MUIButton
            {...passThroughProps}
            type='submit'
            variant='contained'
            color={color}
        />
    );
}

export default Button;
