import React from 'react';
import { Formik, Form } from "formik";
import Button from "@material-ui/core/Button";

import FormikField from "../Components/JobForm/FormikField";
import FormikSelect, { FormikSelectItem } from "../Components/JobForm/FormikSelect";

interface FormValues {
  title: string;
  department: string;
  hours: string; 
  major: string; 
  standing: string; 
  courses: string; 
  expiration: string; 
  description: string; 
}

const initialValues: FormValues = {
  title: "",
  department: "",
  hours: "",
  major: "",
  standing: "",
  courses: "",
  expiration: "",
  description: ""
};

const DepartmentItems: FormikSelectItem[] = [
  {
    label: "Bioengineering",
    value: "bioengineering"
  },
  {
    label: "Chemical Engineering",
    value: "chemical_engineering"
  },
  {
    label: "Computer Science",
    value: "computer_science"
  },
  {
    label: "Computer Engineering",
    value: "computer_engineering"
  },
  {
    label: "Data Science",
    value: "data_science"
  },
  {
    label: "Environmental Engineering",
    value: "environmental_engineering"
  },
  {
      label: "Electrical Engineering",
      value: "electrical_engineering"
  },
  { 
      label: "Materials Science and Engineering",
      value: "materials_sci_engineering"
  },
  {
      label: "Mechanical Engineering",
      value: "mechanical_engineering"
  }
];

const CreateJob: React.FC = () => {
  const handleSubmit = (values: FormValues): void => {
    alert(JSON.stringify(values));
  };

  return (
    <div className="App">
      <h1>Create A Job Post</h1>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
      >
        {({ dirty, isValid }) => {
          return (
            <Form>
              <FormikField name="title" label="Title" required />
              <FormikSelect
                name="department"
                items={DepartmentItems}
                label="Department"
                required
              />
              <FormikField name="hoursPerWeek" label="Hours Per Week" required />
              <FormikField name="major" label="Major" required />
              <FormikField name="standing" label="Standing" required />
              <FormikField name="courses" label="Courses" required />
              <FormikField name="expiration" label="Expiration" required />
              <FormikField name="description" label="Description" required />
              <Button
                variant="contained"
                color="primary"
                disabled={!dirty || !isValid}
                type="submit"
              >
                POST!
              </Button>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};
export default CreateJob;