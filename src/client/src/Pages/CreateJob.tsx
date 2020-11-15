import React from 'react';
import { Formik, Form, Field} from "formik";
import Button from "@material-ui/core/Button";
import * as Yup from 'yup'; 

import FormikField from "../Components/FormikTextField/FormikTextField";
import FormikSelect, { FormikSelectFieldItem } from "../Components/FormikSelectField/FormikSelectField";


interface FormValues {
  title: string;
  hours: string; 
  major: string; 
  targetYears: string; 
  courses: string; 
  startDate: string;
  expirationDate: string; 
  description: string; 
  status: string; 
  type: string; 
  minSalary: string; 
  maxSalary: string; 
}

const initialValues: FormValues = {
  title: "",
  hours: "",
  major: "",
  targetYears: "",
  courses: "",
  startDate: "",
  expirationDate: "",
  description: "", 
  status: "",
  type: "",
  minSalary: "",
  maxSalary: ""
};

// Status Selection 
const StatusItems: FormikSelectFieldItem[] = [
  {
    label: "Hiring", 
    value: "hiring"
  },
  {
    label: "Closed",
    value: "closed" 
  }
]

// Department Selection 
const DepartmentItems: FormikSelectFieldItem[] = [
  { 
    label: "Biology",
    value: "biology"
  },
  {
    label: "Biochemistry",
    value: "biochemistry"
  },
  {
    label: "Bioengineering",
    value: "bioengineering"
  },
  {
    label: "Chemistry",
    value: "chemistry"
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
    label: "Mathematics",
    value: "mathematics"
  },
  { 
      label: "Materials Science and Engineering",
      value: "materials_sci_engineering"
  },
  {
      label: "Mechanical Engineering",
      value: "mechanical_engineering"
  },
  {
    label: "Physics",
    value: "physics"
  },
  {
    label: "Statistics",
    value: "statistics"
  }
];

// Regex for numeric checker
const numericRegex = /^\d+$/; 
const decimalRegex = /^\d*\.?\d*$/;

// Input Validation
const SignupSchema = Yup.object().shape({
  hoursPerWeek: Yup.string()
  .matches(numericRegex, 'All numerics required!')
  .required('Required!'),
  minSalary: Yup.string()
  .matches(decimalRegex, 'Decimal values required!')
  .required('Required!'),
  maxSalary: Yup.string()
  .matches(decimalRegex, 'Decimal values required!')
}) 

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
        validationSchema={SignupSchema}
      >
        {({ dirty, isValid }) => {
          return (
            <Form>
              <FormikField name="title" label="Title" required />
              <div id="checkbox-group">Target Years</div>
            <div role="group" aria-labelledby="checkbox-group">
              <label>
                <Field type="checkbox" name="targetYears" value="freshman" />
                Freshman
              </label>
              <label>
                <Field type="checkbox" name="targetYears" value="sophomore" />
                Sophomore
              </label>
              <label>
                <Field type="checkbox" name="targetYears" value="junior" />
                Junior
              </label>
              <label>
                <Field type="checkbox" name="targetYears" value="senior" />
                Senior
              </label>
            </div>
            <FormikField name="hoursPerWeek" label="Hours Per Week" required />
              <FormikSelect
                name="department"
                items={DepartmentItems}
                label="Department"
                required
              />
              <FormikField name ="type" label="Type" required/>
              <FormikField name ="startDate" label="Start Date" required/>
              <FormikField name ="expirationDate" label="End Date"/>
              <FormikField name="description" label="Description" required />
              <FormikSelect
                name="status"
                items={StatusItems}
                label="Status"
                required
              />
              <FormikField name="minSalary" label="Minimum Salary" required/>
              <FormikField name="maxSalary" label="Maximum Salary" />
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