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
import { Pagination } from '@material-ui/lab';

interface props {
    setJobs: (jobs: IJob[]) => void;
    children: JSX.Element; // react component which is the list of jobs and job description
}

interface JobSearchFormType {
    title: string;
    minSalary: string;
    hoursPerWeek: string;
}

const formInitialValues = {
    title: '',
    minSalary: '',
    hoursPerWeek: '',
};

const formSchema = yup.object({
    title: yup.string().required(),
    minSalary: yup.number().min(0).optional(),
    hoursPerWeek: yup.number().moreThan(0).optional(),
});

const numOfItems = 3;

function JobSearchForm({ setJobs, children }: props) { // actual component and we decompose the props
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
                formState.minSalary,
                formState.hoursPerWeek,
                //page # is not coming from form, coming from internal call
                page,
                numOfItems,
            ),
        [formState, page] //where you put the data that your callback depends on
    );

    // make 2 functions in this form

    //console.log(`numOfItems in index.tsx is ${numOfItems}`); //this logs 3
    const [sendRequest, isLoading] = useApi(request, { //sendRequest (getJobs()) is connected to request)
        onSuccess: (response) => {
            const jobs = response.data.jobs;
            const count = response.data.jobsCount;
            if (jobs.length === 0) { //maybe use count
                snack('No jobs were found', 'warning');
            } else {
                setNumOfPages(count/numOfItems);
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
    };
    
    const handleSearchAgain = () => {
        if (page > 0) {
            setPage(1);
        }
        sendRequest();

    }
    return ( //after this is the JSX part
        <div>
            <Paper style={{ padding: 30 }}>
                <Formik
                    validationSchema={formSchema}
                    initialValues={formInitialValues}
                    onSubmit={(formValues) => {
                        setFormState(formValues);
                        //sendRequest(); //new function and calls sendreq inside of it at the end
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
            {children}
            {
                numOfPages > 1 &&
                <Grid container justify='center' style={{marginTop:50}}>
                    <Pagination
                        color='primary'
                        shape='rounded'
                        // need to do count(?) only showing one page right now
                        page={page}
                        count={numOfPages}
                        onChange={handlePageChange}
                    />
                </Grid>
            }
        </div>
    );
}

export default JobSearchForm;
