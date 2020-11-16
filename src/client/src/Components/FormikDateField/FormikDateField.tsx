import React from "react";
import { ErrorMessage, Field } from "formik";
import TextField from "@material-ui/core/TextField";

interface FormikDateFieldProps {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
}

const FormikDateField: React.FC<FormikDateFieldProps> = ({ name, label, type = "text", required = false}) => {
  return (
      <Field
        required={required}
        autoComplete="off"
        as={TextField}
        label={label}
        name={name}
        fullWidth
        type={type}
        InputLabelProps={{
            shrink: true,
          }}
        helperText={<ErrorMessage name={name} />}
      />
  );
};

export default FormikDateField;