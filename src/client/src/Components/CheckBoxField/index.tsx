import React from 'react';
import { FieldProps, getIn } from 'formik';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

export const CheckBoxField: React.FC<FieldProps & { label: string }> = ({
    label,
    field,
    form,
    ...props
}) => {
    const errorText =
        getIn(form.touched, field.name) && getIn(form.errors, field.name);

    return (
        <FormControlLabel
            control={<Checkbox {...field} />}
            // error={!!errorText}
            label={label}
            {...props}
        />
    );
};
