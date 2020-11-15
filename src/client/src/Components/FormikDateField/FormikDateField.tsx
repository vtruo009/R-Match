import React from "react";
import {ErrorMessage} from "formik"
import TextField from "@material-ui/core/TextField";

interface FormikDateFieldProps {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
}

const FormikDateField: React.FC<FormikDateFieldProps> = ({ name, label, type = "text", required = false}) => {
  return (
      <TextField
        required={required}
        autoComplete="off"
        label={label}
        name={name}
        defaultValue=""
        fullWidth
        type={type}
        InputLabelProps={{shrink:true}}
        helperText={<ErrorMessage name={name}/>}
      />
  );
};

export default FormikDateField;