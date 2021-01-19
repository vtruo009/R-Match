import React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { Formik, Form, Field } from 'formik';
import * as yup from 'yup';
import { SimpleFileUpload } from 'Components/FileUploadField';

import useApi from 'hooks/useApi';
import useSnack from 'hooks/useSnack';
import { DatePickerFormField } from 'Components/DatePickerFormField';
import { TextFormField } from 'Components/TextFormField';
import { SelectFormField } from 'Components/SelectFormField';
import SubmitButton from 'Components/SubmitButton';
import CancelButton from 'Components/CancelButton';
import { classStandingValues, updateStudentProfile } from 'Domains/Student/api';
import AcademicInfo from 'Components/AcademicInfo';
import { classStandingTypes } from '../api';

export interface IStudentProfileForm {
    id: number;
    userId: number;
    firstName: string;
    middleName?: string;
    lastName: string;
    collegeId?: number;
    departmentId?: number;
    sid?: string;
    classStanding?: classStandingTypes;
    email: string;
    biography?: string;
    courseIds?: number[];
    resume?: Buffer;
    transcript?: Buffer;
    workStartDate: string; 
    workEndDate?: string; 
    workEmployer: string; 
    workDescription: string; 
}

interface StudentProfileFormProps {
    studentProfileInformation: IStudentProfileForm;
    onClose: () => void;
    onSuccess: () => void;
}

// TODO FIGURE OUT WHY START DATE CAN'T BE TODAY
const today = new Date();

const formSchema = yup.object({
    firstName: yup.string().required('First name is required'),
    middleName: yup.string().optional().nullable(),
    lastName: yup.string().required('Last name is required'),
    collegeId: yup.number().optional().nullable(),
    departmentId: yup.number().optional().nullable(),
    sid: yup
        .string()
        .matches(/^\d+$/, 'SID must only contain digits')
        .length(9, 'SID must contain 9 digits')
        .optional()
        .nullable(),
    classStanding: yup.string().nullable(),
    biography: yup.string().optional().nullable(),
    resume: yup
        .mixed()
        .test('fileFormat', 'PDF only', (value) => {
            return (
                !value || (value && ['application/pdf'].includes(value.type))
            );
        })
        .optional()
        .nullable(),
    transcript: yup
        .mixed()
        .test('fileFormat', 'PDF only', (value) => {
            return (
                !value || (value && ['application/pdf'].includes(value.type))
            );
        })
        .optional()
        .nullable(),
    workStartDate: yup
        .date()
        .min(today, `Start date must be later than today`)
        .required('Start date is required'),
    workEndDate: yup
        .date()
        .min(yup.ref('startDate'), 'End date must be later than start date')
        .optional()
        .nullable(),
    workEmployer: yup.string().required('Employer name is required'),
    workDescription: yup.string().required('Work description is required'),
});

function StudentProfileForm({
    studentProfileInformation,
    onClose,
    onSuccess,
}: StudentProfileFormProps) {
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
        <Paper style={{ padding: 50 }}>
            <Formik
                validationSchema={formSchema}
                initialValues={studentProfileInformation}
                onSubmit={(formValues) => {
                    setStudentProfile(formValues);
                    sendUpdateProfileRequest();
                }}
            >
                {({setFieldValue}) => (
                    <Form>
                        <Grid
                            container
                            spacing={4}
                            justify='center'
                            alignItems='center'
                        >
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
                                    options={classStandingValues}
                                    component={SelectFormField}
                                    defaultLabel='Select your class standing'
                                />
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <Field
                                    name='sid'
                                    label='SID'
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
                            <Field component={AcademicInfo} showCourses />
                            <Grid item md={6} xs={12}>
                                <Field
                                    name='workStartDate'
                                    label='Work Experience Start Date'
                                    component={DatePickerFormField}
                                />
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <Field
                                    name='workEndDate'
                                    label='Work Experience End Date'
                                    component={DatePickerFormField}
                                />
                            </Grid>
                            <Grid item md={12} xs={12}>
                                <Field
                                    name='workEmployer'
                                    label='Work Experience Employer'
                                    component={TextFormField}
                                />
                            </Grid>
                            <Grid item md={12} xs={12}>
                                <Field
                                    name='workDescription'
                                    label='Work Experience Description'
                                    multiline
                                    component={TextFormField}
                                />
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <SubmitButton
                                    fullWidth
                                    isLoading={isUpdatingProfileLoading}
                                />
                            </Grid>
                            <Grid item md={6} xs={12}>
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
