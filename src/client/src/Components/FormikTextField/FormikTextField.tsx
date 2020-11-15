import React from "react";
import { ErrorMessage, Field } from "formik";
import TextField from "@material-ui/core/TextField";

interface FormikTextFieldProps {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
}

const FormikTextField: React.FC<FormikTextFieldProps> = ({ name, label, type = "text", required = false}) => {
  return (
      <Field
        required={required}
        autoComplete="off"
        as={TextField}
        label={label}
        name={name}
        fullWidth
        type={type}
        helperText={<ErrorMessage name={name} />}
      />
  );
};

export default FormikTextField;