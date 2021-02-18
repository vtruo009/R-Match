import React from 'react';
import SearchIcon from '@material-ui/icons/Search';
import Grid from '@material-ui/core/Grid';
import { Formik, Form, Field } from 'formik';
import * as yup from 'yup';

import Card from 'Components/Card';
import SubmitButton from 'Components/SubmitButton';
import useApi from 'hooks/useApi';
import useSnack from 'hooks/useSnack';
import usePagination from 'hooks/usePagination';
import { TextFormField } from 'Components/TextFormField';
import { getJobs, IJob, jobTypes } from 'Domains/Jobs/api';
import { SelectFormField } from 'Components/SelectFormField';
import { DatePickerFormField } from 'Components/DatePickerFormField';

interface JobSearchFormProps {
    setJobs: (jobs: IJob[]) => void;
    children: JSX.Element;
}

interface JobSearchFormType {
    title: string;
    types: string[];
    startDate: string;
    minSalary: string;
    hoursPerWeek: string;
}

const formInitialValues: JobSearchFormType = {
    title: '',
    types: [],
    startDate: '',
    minSalary: '',
    hoursPerWeek: '',
};

const formSchema = yup.object({
    title: yup.string().required(),
    types: yup.array().required(),
    startDate: yup.date().optional(),
    minSalary: yup.number().min(0).optional(),
    hoursPerWeek: yup.number().moreThan(0).optional(),
});

const numOfItems = 10;
function JobSearchForm({ setJobs, children }: JobSearchFormProps) {
    const [formState, setFormState] = React.useState<JobSearchFormType>(
        formInitialValues
    );
    const {
        page,
        setPage,
        setNumOfPages,
        PaginationProps,
        Pagination,
    } = usePagination();
    const [snack] = useSnack();
    const request = React.useCallback(
        () =>
            getJobs(
                formState.title,
                formState.types,
                formState.startDate,
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
            if (jobs.length === 0) {
                snack('No jobs were found', 'warning');
            } else {
                setNumOfPages(Math.ceil(count / numOfItems));
                setJobs(jobs);
            }
        },
    });

    const handleSearchAgain = () => {
        if (page > 0) setPage(1);
        sendRequest();
    };

    return (
        <div>
            <Card>
                <Formik
                    validationSchema={formSchema}
                    initialValues={formInitialValues}
                    onSubmit={(formValues) => {
                        setFormState(formValues);
                        handleSearchAgain();
                    }}
                >
                    {() => (
                        <Form style={{ padding: 10 }}>
                            <Grid
                                container
                                spacing={4}
                                alignItems='center'
                                justify='center'
                            >
                                <Grid item md={4} xs={12}>
                                    <Field
                                        name='title'
                                        label='Title'
                                        component={TextFormField}
                                    />
                                </Grid>
                                <Grid item md={4} xs={12}>
                                    <Field
                                        name='types'
                                        label='Types'
                                        options={jobTypes}
                                        multiple
                                        component={SelectFormField}
                                    />
                                </Grid>
                                <Grid item md={4} xs={12}>
                                    <Field
                                        name='startDate'
                                        label='Start date'
                                        component={DatePickerFormField}
                                    />
                                </Grid>
                                <Grid item md={4} xs={12}>
                                    <Field
                                        name='minSalary'
                                        label='Minimum Salary'
                                        component={TextFormField}
                                        type='number'
                                    />
                                </Grid>
                                <Grid item md={4} xs={12}>
                                    <Field
                                        name='hoursPerWeek'
                                        label='Minimum hours per week'
                                        component={TextFormField}
                                        type='number'
                                    />
                                </Grid>
                                <Grid
                                    container
                                    justify='flex-end'
                                    item
                                    md={4}
                                    xs={12}
                                >
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
            </Card>
            {children}
            <Pagination {...PaginationProps} onPageChange={sendRequest} />
        </div>
    );
}

export default JobSearchForm;
