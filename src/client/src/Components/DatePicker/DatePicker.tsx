import React from 'react';
import TextField, { TextFieldProps } from '@material-ui/core/TextField';

function DatePicker({ ...passThroughProps }: TextFieldProps) {
    return (
        <TextField
            fullWidth
            type='date'
            InputLabelProps={{
                shrink: true,
            }}
            {...passThroughProps}
        />
    );
}

export default DatePicker;
