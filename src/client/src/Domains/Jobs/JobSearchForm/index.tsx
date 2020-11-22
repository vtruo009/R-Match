import React from 'react';
import SearchIcon from '@material-ui/icons/Search';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { Formik, Form, Field } from 'formik';
import * as yup from 'yup';

import Button from 'Components/Button';
import useApi from 'hooks/useApi';
import useSnack from 'hooks/useSnack';
import Loader from 'Components/Loader';
import { TextFormField } from 'Components/TextFormField';
import { getJobs, IJob } from 'Domains/Jobs/api/api';

interface props {
    setJobs: (jobs: IJob[]) => void;
}

interface JobSearchFormType {
    title: string;
    minSalary: string;
    minHoursPerWeek: string;
}

const formInitialValues = {
    title: '',
    minSalary: '',
    minHoursPerWeek: '',
};

const formSchema = yup.object({
    title: yup.string().required(),
    minSalary: yup.number().min(0).optional(),
    minHoursPerWeek: yup.number().moreThan(0).optional(),
});

function JobSearchForm({ setJobs }: props) {
    const [formState, setFormState] = React.useState<JobSearchFormType>(
        formInitialValues
    );
    const [snack] = useSnack();
    const request = React.useCallback(
        () =>
            getJobs(
                formState.title,
                formState.minSalary,
                formState.minHoursPerWeek
            ),
        [formState]
    );
    const [sendRequest, isLoading] = useApi(request, {
        onSuccess: (response) => {
            const jobs = response.data.jobs;
            if (jobs.length === 0) {
                snack('No jobs were found', 'warning');
            } else {
                setJobs(jobs);
            }
        },
    });
    return (
        <Paper style={{ padding: 30 }}>
            <Formik
                validationSchema={formSchema}
                initialValues={formInitialValues}
                onSubmit={(formValues) => {
                    setFormState(formValues);
                    sendRequest();
                }}
            >
                {() => (
                    <Form>
                        <Grid
                            container
                            spacing={4}
                            alignItems='center'
                            justify='center'
                        >
                            <Grid item md={3} xs={12}>
                                <Field
                                    name='title'
                                    label='Title'
                                    component={TextFormField}
                                />
                            </Grid>

                            <Grid item md={2} xs={12}>
                                <Field
                                    name='minSalary'
                                    label='Minimum Salary'
                                    component={TextFormField}
                                    type='number'
                                />
                            </Grid>

                            <Grid item md={3} xs={12}>
                                <Field
                                    name='minHoursPerWeek'
                                    label='Minimum hours per week'
                                    component={TextFormField}
                                    type='number'
                                />
                            </Grid>
                            <Grid item md={2} xs={12}>
                                <Button
                                    type='submit'
                                    isLoading={isLoading}
                                    startIcon={<SearchIcon />}
                                >
                                    Search
                                </Button>
                            </Grid>
                            <Grid item md={1} xs={12}>
                                {isLoading && <Loader size={50} />}
                            </Grid>
                        </Grid>
                    </Form>
                )}
            </Formik>
        </Paper>
    );
}

export default JobSearchForm;
