import React from 'react';
import MUITextField, { TextFieldProps } from '@material-ui/core/TextField';

interface props {
    children?: JSX.Element;
}
function TextField({ children, ...passThroughProps }: props & TextFieldProps) {
    return (
        <MUITextField
            fullWidth
            {...passThroughProps}
            autoComplete='off'
            autoCorrect='off'
            autoCapitalize='off'
        >
            {children}
        </MUITextField>
    );
}

export default TextField;
