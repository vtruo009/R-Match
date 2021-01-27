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
    firstName?: string;
    lastName?: string;
    classStandings?: classStandingTypes[];
    collegeId?: number;
    departmentId?: number;
    email?: string;
    sid?: string;
}

const formInitialValues: IStudentSearchForm = {
    firstName: '',
    lastName: '',
    classStandings: [],
    collegeId: undefined,
    departmentId: undefined,
    email: '',
    sid: '',
};

const formSchema = yup.object({
    firstName: yup.string().optional(),
    lastName: yup.string().optional(),
    classStandings: yup.array(yup.string()).optional(),
    collegeId: yup.number().optional(),
    departmentId: yup.number().optional(),
    email: yup.string().optional().email('Please enter valid email.'),
    sid: yup
        .string()
        .matches(/^\d+$/, 'SID must only contain digits')
        .length(9, 'SID must contain 9 digits')
        .optional(),
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
                page,
                numOfItems,
                formState.firstName,
                formState.lastName,
                formState.classStandings,
                formState.departmentId,
                formState.email,
                formState.sid
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
                                        name='classStandings'
                                        label='Class standing'
                                        multiple
                                        options={classStandingValues}
                                        component={SelectFormField}
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <Field
                                        name='email'
                                        label='Email'
                                        component={TextFormField}
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <Field
                                        name='sid'
                                        label='SID'
                                        component={TextFormField}
                                    />
                                </Grid>
                                <Field component={AcademicInfo} />
                                <Grid item xs={12}>
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
