import React from 'react';
import { FieldProps, getIn } from 'formik';
import { TextField } from '@material-ui/core';

export const DatePickerFormField: React.FC<FieldProps> = ({
    field,
    form,
    ...props
}) => {
    const errorText =
        getIn(form.touched, field.name) && getIn(form.errors, field.name);

    return (
        <TextField
            type='date'
            InputLabelProps={{
                shrink: true,
            }}
            fullWidth
            helperText={errorText}
            error={!!errorText}
            {...field}
            {...props}
        />
    );
};
