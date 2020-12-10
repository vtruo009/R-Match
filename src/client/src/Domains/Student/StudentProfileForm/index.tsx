import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { Formik, Form, Field } from 'formik';
import * as yup from 'yup';
import { SimpleFileUpload } from 'formik-material-ui';

import useApi from 'hooks/useApi';
import useSnack from 'hooks/useSnack';
import Loader from 'Components/Loader';
import { TextFormField } from 'Components/TextFormField';
import { SelectFormField } from 'Components/SelectFormField';
import Button from 'Components/Button';
import {
    classStandingTypes,
    updateStudentProfile,
    getStudentProfile,
} from 'Domains/Student/api/api';

import { departments, courseList } from 'sharedData';

export interface IStudentProfileForm {
    firstName: string;
    middleName?: string;
    lastName: string;
    departmentId?: string;
    sid?: number;
    classStanding?: string;
    email: string;
    biography?: string;
    courses?: string[];
    resume?: File;
    transcript?: File;
}

const formInitialValues: IStudentProfileForm = {
    firstName: '',
    middleName: '',
    lastName: '',
    departmentId: '',
    sid: 0,
    classStanding: '',
    email: '',
    biography: '',
    courses: [],
    resume: undefined,
    transcript: undefined,
};

const formSchema = yup.object({
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    departmentId: yup.string(),
    sid: yup.string().required('Student ID is is required'),
    classStanding: yup.string(),
    email: yup.string().email('Please enter valid email'),
    biography: yup.string(),
    resume: yup
        .mixed()
        .test('fileFormat', 'PDF only', (value) => {
            return (
                !value || (value && ['application/pdf'].includes(value.type))
            );
        })
        .optional(),
    transcript: yup
        .mixed()
        .test('fileFormat', 'PDF only', (value) => {
            return (
                !value || (value && ['application/pdf'].includes(value.type))
            );
        })
        .optional(),
});

// TODO: Make sure PDF Files are not greater than some number of bytes

function StudentProfileForm() {
    const [
        studentProfile,
        setStudentProfile,
    ] = React.useState<IStudentProfileForm>(formInitialValues);

    const [snack] = useSnack();

    const updateProfileRequest = React.useCallback(
        () => updateStudentProfile(studentProfile),
        [studentProfile]
    );
    const [sendUpdateProfileRequest, isUpdatingProfileLoading] = useApi(
        updateProfileRequest,
        {
            onSuccess: () => {
                snack('Student profile successfully created!', 'success');
            },
        }
    );

    const getProfileRequest = React.useCallback(() => getStudentProfile(), []);
    const [sendGetProfileRequest, isGettingProfileLoading] = useApi(
        getProfileRequest,
        {
            onSuccess: (results) => {
                // setStudentProfile(results.data.student);
            },
        }
    );

    React.useEffect(() => {});

    return (
        <Paper style={{ padding: 50 }}>
            <Formik
                validationSchema={formSchema}
                initialValues={formInitialValues}
                onSubmit={(formValues, actions) => {
                    console.log(formValues);
                    setStudentProfile(formValues);
                    sendUpdateProfileRequest();
                    actions.resetForm({
                        values: { ...formInitialValues },
                    });
                }}
            >
                {() => (
                    <Form>
                        <Grid container spacing={3} alignContent='center'>
                            <Grid item container justify='flex-start'>
                                <Typography variant='h4'>
                                    Student Profile
                                </Typography>
                            </Grid>
                            <Grid item container spacing={5}>
                                <Grid item md={4} xs={12}>
                                    <Field
                                        name='firstName'
                                        label='First Name'
                                        component={TextFormField}
                                    />
                                </Grid>
                                <Grid item md={4} xs={12}>
                                    <Field
                                        name='middleName'
                                        label='Middle Name'
                                        component={TextFormField}
                                    />
                                </Grid>
                                <Grid item md={4} xs={12}>
                                    <Field
                                        name='lastName'
                                        label='Last Name'
                                        component={TextFormField}
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <Field
                                        name='email'
                                        label='Email'
                                        disabled
                                        component={TextFormField}
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <Field
                                        name='classStanding'
                                        label='Class Standing'
                                        options={classStandingTypes}
                                        component={SelectFormField}
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <Field
                                        name='sid'
                                        label='SID'
                                        type='number'
                                        component={TextFormField}
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <Field
                                        name='departmentId'
                                        label='Department'
                                        options={departments}
                                        component={SelectFormField}
                                    />
                                </Grid>

                                <Grid item md={6} xs={12}>
                                    <Field
                                        name='transcript'
                                        label='Transcript'
                                        type='file'
                                        component={SimpleFileUpload}
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <Field
                                        name='resume'
                                        label='Resume'
                                        type='file'
                                        component={SimpleFileUpload}
                                    />
                                </Grid>
                                <Grid item md={12} xs={12}>
                                    <Field
                                        name='biography'
                                        label='Biography'
                                        multiline
                                        component={TextFormField}
                                    />
                                </Grid>
                                <Grid item md={12} xs={12}>
                                    <Field
                                        name='courses'
                                        label='Courses'
                                        options={courseList}
                                        multiple
                                        component={SelectFormField}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container item xs={12}>
                                <Button
                                    type='submit'
                                    isLoading={isUpdatingProfileLoading}
                                >
                                    Submit
                                    {isUpdatingProfileLoading && (
                                        <Loader size={20} />
                                    )}
                                </Button>
                            </Grid>
                        </Grid>
                    </Form>
                )}
            </Formik>
        </Paper>
    );
}

export default StudentProfileForm;
