import React from 'react';
import { FieldProps, getIn } from 'formik';
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
} from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';

export type IOptions = Array<{ label: string; value: string | number }>;

interface SelectFormFieldProps {
    label?: string;
    defaultLabel?: string;
    options: IOptions;
}

export const SelectFormField: React.FC<FieldProps & SelectFormFieldProps> = ({
    field,
    form,
    label,
    options,
    defaultLabel,
    ...props
}) => {
    const errorText =
        getIn(form.touched, field.name) && getIn(form.errors, field.name);

    const getLabel = (value: string | number) =>
        options.find((option) => option.value === value)?.label;

    const valuesToRender = () =>
        typeof field.value === 'object'
            ? field.value
                  .map((fieldValue: string | number) => getLabel(fieldValue))
                  .join(', ')
            : getLabel(field.value);

    return (
        <FormControl fullWidth error={!!errorText}>
            {label && <InputLabel>{label}</InputLabel>}
            <Select
                fullWidth
                {...field}
                {...props}
                renderValue={valuesToRender}
            >
                {defaultLabel && (
                    <MenuItem value={undefined} disabled>
                        {defaultLabel}
                    </MenuItem>
                )}
                {options.map((op, index) => (
                    <MenuItem key={index} value={op.value}>
                        {typeof field.value === 'object' && (
                            <Checkbox
                                checked={field.value.includes(op.value)}
                            />
                        )}
                        {op.label}
                    </MenuItem>
                ))}
            </Select>
            <FormHelperText>{errorText}</FormHelperText>
        </FormControl>
    );
};
