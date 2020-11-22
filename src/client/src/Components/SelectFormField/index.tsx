import React from 'react';
import { FieldProps, getIn } from 'formik';
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
} from '@material-ui/core';

interface SelectFormFieldProps {
    label?: string;
    options: Array<{ label: string; value: string }>;
}

export const SelectFormField: React.FC<FieldProps & SelectFormFieldProps> = ({
    field,
    form,
    label,
    options,
    ...props
}) => {
    const errorText =
        getIn(form.touched, field.name) && getIn(form.errors, field.name);
    return (
        <FormControl fullWidth error={!!errorText}>
            {label && <InputLabel>{label}</InputLabel>}
            <Select fullWidth {...field} {...props}>
                {options.map((op) => (
                    <MenuItem key={op.value} value={op.value}>
                        {op.label}
                    </MenuItem>
                ))}
            </Select>
            <FormHelperText>{errorText}</FormHelperText>
        </FormControl>
    );
};
