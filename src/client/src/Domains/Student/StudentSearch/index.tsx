import React from 'react';
import SearchIcon from '@material-ui/icons/Search';
import Grid from '@material-ui/core/Grid';
import { Formik, Form, Field } from 'formik';
import * as yup from 'yup';

import useApi from 'hooks/useApi';
import useSnack from 'hooks/useSnack';
import usePagination from 'hooks/usePagination';
import Card from 'Components/Card';
import SubmitButton from 'Components/SubmitButton';
import { TextFormField } from 'Components/TextFormField';
import {
    IStudentPreview,
    classStandingTypes,
    getStudents,
    classStandingValues,
} from 'Domains/Student/api';
import { SelectFormField } from 'Components/SelectFormField';
import AcademicInfo from 'Components/AcademicInfo';
import StudentsList from 'Domains/Student/StudentsList';

interface IStudentSearchForm {
    firstName?: string;
    lastName?: string;
    classStandings?: classStandingTypes[];
    departmentId?: number[];
    email?: string;
    sid?: string;
}

const formInitialValues: IStudentSearchForm = {
    firstName: '',
    lastName: '',
    classStandings: [],
    departmentId: [],
    email: '',
    sid: '',
};

const formSchema = yup.object({
    firstName: yup.string().optional(),
    lastName: yup.string().optional(),
    classStandings: yup.array(yup.string()).optional(),
    departmentId: yup.array(yup.number()).optional(),
    email: yup.string().optional().email('Please enter valid email.'),
    sid: yup
        .string()
        .matches(/^\d+$/, 'SID must only contain digits')
        .length(9, 'SID must contain 9 digits')
        .optional(),
});
const numOfItems = 5;
function StudentSearchForm() {
    const [formState, setFormState] = React.useState<IStudentSearchForm>(
        formInitialValues
    );
    const [studentPreviews, setStudentPreviews] = React.useState<
        IStudentPreview[]
    >([]);
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
            const { studentPreviews, studentsCount } = response.data;
            if (studentPreviews.length === 0) {
                snack('No students were found', 'warning');
            } else {
                setNumOfPages(Math.ceil(studentsCount / numOfItems));
                setStudentPreviews(studentPreviews);
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
                                        label='Class standings'
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
                                <Field
                                    component={AcademicInfo}
                                    multipleDepartments
                                />
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
            <div style={{ paddingTop: 30 }}>
                {studentPreviews.length > 0 && (
                    <StudentsList
                        studentPreviews={studentPreviews}
                    ></StudentsList>
                )}
            </div>
            <Pagination {...PaginationProps} onPageChange={sendRequest} />
        </div>
    );
}
export default StudentSearchForm;
