import React from 'react';
import SearchIcon from '@material-ui/icons/Search';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { Formik, Form, Field } from 'formik';
import * as yup from 'yup';

import SubmitButton from 'Components/SubmitButton';
import useApi from 'hooks/useApi';
import useSnack from 'hooks/useSnack';
import { TextFormField } from 'Components/TextFormField';
import { getJobs, IJob, jobTypes } from 'Domains/Jobs/api';
import { Pagination } from '@material-ui/lab';
import { SelectFormField } from 'Components/SelectFormField';

interface props {
    setJobs: (jobs: IJob[]) => void;
    children: JSX.Element;
}

interface JobSearchFormType {
    title: string;
    types: string[];
    minSalary: string;
    hoursPerWeek: string;
}

const formInitialValues = {
    title: '',
    types: [],
    minSalary: '',
    hoursPerWeek: '',
};

const formSchema = yup.object({
    title: yup.string().required(),
    // TODO: should be array type?
    types: yup.string().required(),
    minSalary: yup.number().min(0).optional(),
    hoursPerWeek: yup.number().moreThan(0).optional(),
});

const numOfItems = 5;
function JobSearchForm({ setJobs, children }: props) {
    const [formState, setFormState] = React.useState<JobSearchFormType>(
        formInitialValues
    );
    const [page, setPage] = React.useState(1);
    const [numOfPages, setNumOfPages] = React.useState(0);
    const [snack] = useSnack();
    const request = React.useCallback(
        () =>
            getJobs(
                formState.title,
                formState.types,
                formState.minSalary,
                formState.hoursPerWeek,
                page,
                numOfItems
            ),
        [formState, page]
    );

    const [sendRequest, isLoading] = useApi(request, {
        onSuccess: (response) => {
            const jobs = response.data.jobs;
            const count = response.data.jobsCount;
            console.log(count);

            if (jobs.length === 0) {
                snack('No jobs were found', 'warning');
            } else {
                setNumOfPages(Math.ceil(count / numOfItems));
                setJobs(jobs);
            }
        },
    });

    const handlePageChange = (
        event: React.ChangeEvent<unknown>,
        value: number
    ) => {
        setPage(value);
        sendRequest();
        window.scrollTo(0, 0);
    };

    const handleSearchAgain = () => {
        if (page > 0) {
            setPage(1);
        }
        sendRequest();
    };

    return (
        <div>
            <Paper style={{ padding: 30 }}>
                <Formik
                    validationSchema={formSchema}
                    initialValues={formInitialValues}
                    onSubmit={(formValues) => {
                        setFormState(formValues);
                        handleSearchAgain();
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
                                <Grid item md={3} xs={12}>
                                    <Field
                                        name='types'
                                        label='Types'
                                        options={jobTypes}
                                        multiple
                                        component={SelectFormField}
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
                                        name='hoursPerWeek'
                                        label='Minimum hours per week'
                                        component={TextFormField}
                                        type='number'
                                    />
                                </Grid>
                                <Grid item md={2} xs={12}>
                                    <SubmitButton
                                        isLoading={isLoading}
                                        startIcon={<SearchIcon />}
                                        label='Search'
                                    />
                                </Grid>
                            </Grid>
                        </Form>
                    )}
                </Formik>
            </Paper>
            {children}
            {numOfPages > 1 && (
                <Grid container justify='center' style={{ marginTop: 50 }}>
                    <Pagination
                        color='primary'
                        shape='rounded'
                        page={page}
                        count={numOfPages}
                        onChange={handlePageChange}
                    />
                </Grid>
            )}
        </div>
    );
}

export default JobSearchForm;
