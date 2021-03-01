import React from 'react';
import { FieldProps } from 'formik';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

export const CheckBoxField: React.FC<FieldProps & { label: string }> = ({
    label,
    field,
    form,
    ...props
}) => {
    return (
        <FormControlLabel
            control={<Checkbox {...field} />}
            label={label}
            {...props}
        />
    );
};
