import React from 'react';
import SearchIcon from '@material-ui/icons/Search';
import Grid from '@material-ui/core/Grid';
import { Pagination } from '@material-ui/lab';
import { Formik, Form, Field } from 'formik';
import * as yup from 'yup';

import Card from 'Components/Card';
import SubmitButton from 'Components/SubmitButton';
import useApi from 'hooks/useApi';
import useSnack from 'hooks/useSnack';
import { TextFormField } from 'Components/TextFormField';
import {
    IStudent,
    classStandingTypes,
    getStudents,
    classStandingValues,
} from 'Domains/Student/api';
import { SelectFormField } from 'Components/SelectFormField';
import AcademicInfo from 'Components/AcademicInfo';

interface StudentSearchFormProps {
    setStudents: (students: IStudent[]) => void;
    children: JSX.Element;
}

interface IStudentSearchForm {
    firstName: string;
    lastName: string;
    classStanding?: classStandingTypes;
    collegeId?: number;
    departmentId?: number;
}

const formInitialValues: IStudentSearchForm = {
    firstName: '',
    lastName: '',
    classStanding: undefined,
    collegeId: undefined,
    departmentId: undefined,
};

const formSchema = yup.object({
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    classStanding: yup.string().optional(),
    collegeId: yup.number().optional(),
    departmentId: yup.number().optional(),
});

const numOfItems = 5;

function StudentSearchForm({ setStudents, children }: StudentSearchFormProps) {
    const [formState, setFormState] = React.useState<IStudentSearchForm>(
        formInitialValues
    );
    const [page, setPage] = React.useState(1);
    const [numOfPages, setNumOfPages] = React.useState(0);
    const [snack] = useSnack();
    const request = React.useCallback(
        () =>
            getStudents(
                formState.firstName,
                formState.lastName,
                page,
                numOfItems,
                formState.classStanding,
                formState.departmentId
            ),
        [formState, page]
    );

    const [sendRequest, isLoading] = useApi(request, {
        onSuccess: (response) => {
            const students = response.data.students;
            const count = response.data.studentsCount;
            if (students.length === 0) {
                snack('No students were found', 'warning');
            } else {
                setNumOfPages(Math.ceil(count / numOfItems));
                setStudents(students);
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
            <Card style={{ borderRadius: 25, padding: 40 }}>
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
                            <Grid container spacing={4}>
                                <Grid item md={4} xs={12}>
                                    <Field
                                        name='firstName'
                                        label='First name'
                                        component={TextFormField}
                                    />
                                </Grid>
                                <Grid item md={4} xs={12}>
                                    <Field
                                        name='lastName'
                                        label='Last name'
                                        component={TextFormField}
                                    />
                                </Grid>
                                <Grid item md={4} xs={12}>
                                    <Field
                                        name='classStanding'
                                        label='Class standing'
                                        options={classStandingValues}
                                        component={SelectFormField}
                                    />
                                </Grid>
                                <Field component={AcademicInfo} />
                                <Grid container item xs={12} justify='flex-end'>
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

export default StudentSearchForm;
