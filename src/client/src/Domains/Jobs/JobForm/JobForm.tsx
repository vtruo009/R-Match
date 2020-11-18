import React from 'react';
import { Formik, Form, Field} from "formik";
import Button from "@material-ui/core/Button";
import FormikField from "../../../Components/FormikTextField/FormikTextField";
import FormikSelect, { FormikSelectFieldItem } from "../../../Components/FormikSelectField/FormikSelectField";
import FormikDateField from "../../../Components/FormikDateField/FormikDateField"; 
//import useApi from '../../../hooks/useApi';
//import useSnack from '../../../hooks/useSnack';
//import { setJobs, IJob } from '../api/api'; 
import Axios from 'axios'; 
//import { toast } from 'react-toastify';
//import { setJobs } from '../api/api';
//import { ActionSchedule } from 'material-ui/svg-icons';

interface FormValues {
  targetYears: string[],
  hoursPerWeek: number,
  expirationDate: string,
  startDate: string,
  endDate: string,
  type: string[],
  title: string, 
  status: string, 
  minSalary: number, 
  maxSalary: number, 
  departmentID: string
}

const initialValues: FormValues = {
  targetYears: [],
  hoursPerWeek: 0,
  expirationDate: "", 
  startDate: "",
  endDate: "",
  type: [],
  title: "", 
  status: "", 
  minSalary: 0, 
  maxSalary: 0, 
  departmentID: ""
};

// Type Selection
const TypeItems : FormikSelectFieldItem[] = [
  {
    label: "grader",
    value: 'grader'
  },
  {
    label: "assistant",
    value: 'assistant'
  },
  {
    label: "researcher",
    value: 'researcher'
  },
  {
    label: "volunteer",
    value: 'volunteer'
  },
  {
    label: "tutor",
    value: 'tutor'
  },
  {
    label: "other",
    value: 'other'
  }
]
// Status Selection 
const StatusItems: FormikSelectFieldItem[] = [
  {
    label: "Hiring", 
    value: "Hiring"
  },
  {
    label: "Closed",
    value: "Closed" 
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

//const apiUrl = "http://localhost:5000"
const JobForm: React.FC = () => {
  const handleSubmit = (values: FormValues): void => {
    alert(JSON.stringify(values));
    console.log('Form data', values)
    Axios.post('http://localhost:5000/api/job/create',{values})
  };
  return (
    <div className="App">
      <h1>Create A Job Post</h1>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        //validationSchema={SignupSchema}
        //onSubmit={async (input, {resetForm}) => {
          ///await Axios.post(`${apiUrl}/api/job/create`,input).then(res => {
            //toast.success(res.data)
            //console.log('Form data', values)
            //resetForm({})
          //})
          //.catch(err => {
            //toast.error('Something went wrong.');   });  }}
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
            <FormikField name="hoursPerWeek" label="Hours Per Week" required type="number" />
              <FormikSelect
                name="departmentID"
                items={DepartmentItems}
                label="Department"
                required
              />
              <FormikSelect
                name="type"
                items={TypeItems}
                label="Type"
                required
              />
              <FormikDateField name="expirationDate" label="Expiration Date" required type="date"  />
              <FormikDateField name="startDate" label="Start Date" required  type="date"/>
              <FormikDateField name="endDate" label="End Date" type="date"/>
              <FormikField name="description" label="Description" required />
              <FormikSelect
                name="status"
                items={StatusItems}
                label="Status"
                required
              />
              <FormikField name="minSalary" label="Minimum Salary" required type="number"/>
              <FormikField name="maxSalary" label="Maximum Salary" type="number"/>
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
export default JobForm;