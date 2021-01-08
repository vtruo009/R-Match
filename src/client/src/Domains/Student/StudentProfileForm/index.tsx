import React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { Formik, Form, Field } from 'formik';
import * as yup from 'yup';
import { SimpleFileUpload } from 'formik-material-ui';

import useApi from 'hooks/useApi';
import useSnack from 'hooks/useSnack';
import { TextFormField } from 'Components/TextFormField';
import { SelectFormField } from 'Components/SelectFormField';
import SubmitButton from 'Components/SubmitButton';
import CancelButton from 'Components/CancelButton';
import {
    classStandingTypes,
    updateStudentProfile,
} from 'Domains/Student/api/api';
import AcademicInfo from 'Components/AcademicInfo';

export interface IStudentProfileForm {
    id: number;
    userId: number;
    firstName: string;
    middleName?: string;
    lastName: string;
    collegeId?: number;
    departmentId?: number;
    sid?: number;
    classStanding?: string;
    email: string;
    biography?: string;
    courseIds?: number[];
    resume?: File;
    transcript?: File;
}

interface Props {
    studentProfileInformation: IStudentProfileForm;
    onClose: () => void;
    onSuccess: () => void;
}

const formSchema = yup.object({
    firstName: yup.string().required('First name is required'),
    middleName: yup.string().nullable(),
    lastName: yup.string().required('Last name is required'),
    departmentId: yup.string(),
    sid: yup.string().nullable(),
    classStanding: yup.string().nullable(),
    email: yup.string().email('Please enter valid email'),
    biography: yup.string().nullable(),
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

function StudentProfileForm({
    studentProfileInformation,
    onClose,
    onSuccess,
}: Props) {
    const [
        studentProfileForm,
        setStudentProfile,
    ] = React.useState<IStudentProfileForm>(studentProfileInformation);
    const [snack] = useSnack();
    const updateProfileRequest = React.useCallback(
        () => updateStudentProfile(studentProfileForm),
        [studentProfileForm]
    );
    const [sendUpdateProfileRequest, isUpdatingProfileLoading] = useApi(
        updateProfileRequest,
        {
            onSuccess: () => {
                onClose();
                onSuccess();
                snack('Student profile successfully updated!', 'success');
            },
        }
    );
    return (
        <Paper style={{ padding: 40 }}>
            <Formik
                validationSchema={formSchema}
                initialValues={studentProfileInformation}
                onSubmit={(formValues) => {
                    setStudentProfile(formValues);
                    sendUpdateProfileRequest();
                }}
            >
                {() => (
                    <Form>
                        <Grid container spacing={4} alignContent='center'>
                            <Grid item md={6} xs={12}>
                                <Field
                                    name='firstName'
                                    label='First Name'
                                    component={TextFormField}
                                />
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <Field
                                    name='middleName'
                                    label='Middle Name'
                                    component={TextFormField}
                                />
                            </Grid>
                            <Grid item md={6} xs={12}>
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
                                    defaultLabel='Select your class standing'
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
                            {/* TODO: Make sure PDF Files are not greater than some number of bytes */}
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
                            <AcademicInfo
                                showCourses
                                collegeIdFromForm={studentProfileForm.collegeId}
                                departmentIdFromForm={
                                    studentProfileForm.departmentId
                                }
                                courseIdsFromForm={studentProfileForm.courseIds}
                            />
                            <Grid item xs={12} md={6}>
                                <SubmitButton
                                    fullWidth
                                    isLoading={isUpdatingProfileLoading}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <CancelButton onClick={onClose} fullWidth />
                            </Grid>
                        </Grid>
                    </Form>
                )}
            </Formik>
        </Paper>
    );
}

export default StudentProfileForm;
