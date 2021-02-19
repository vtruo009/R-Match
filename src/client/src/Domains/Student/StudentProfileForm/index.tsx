import React from 'react';
import Grid from '@material-ui/core/Grid';
import { Formik, Form, Field } from 'formik';
import * as yup from 'yup';

import useApi from 'hooks/useApi';
import useSnack from 'hooks/useSnack';
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
    gpa?: string;
    classStanding?: classStandingTypes;
    email: string;
    biography?: string;
    courseIds?: number[];
}

interface StudentProfileFormProps {
    studentProfileInformation: IStudentProfileForm;
    onClose: () => void;
    onSuccess: () => void;
}

const formSchema = yup.object({
    firstName: yup.string().required('First name is required'),
    middleName: yup.string().optional().nullable(),
    lastName: yup.string().required('Last name is required'),
    collegeId: yup.number().optional().nullable(),
    departmentId: yup.number().optional().nullable(),
    courseIds: yup.array().of(yup.number()).optional(),
    sid: yup
        .string()
        .matches(/^\d+$/, 'SID must only contain digits')
        .length(9, 'SID must contain 9 digits')
        .optional()
        .nullable(),
    gpa: yup
        .string()
        .matches(
            /^[0]|[0-3]\.(\d?\d?)|[4].[0]$/,
            'GPA must be in the range 0.00 - 4.00'
        )
        .optional()
        .nullable(),
    classStanding: yup.string().nullable(),
    biography: yup.string().optional().nullable(),
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
                snack('Profile successfully updated', 'success');
            },
        }
    );
    return (
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
                        <Grid item md={4} xs={12}>
                            <Field
                                name='classStanding'
                                label='Class Standing'
                                options={classStandingValues}
                                component={SelectFormField}
                                defaultLabel='Select your class standing'
                            />
                        </Grid>
                        <Grid item md={4} xs={12}>
                            <Field
                                name='sid'
                                label='SID'
                                component={TextFormField}
                            />
                        </Grid>
                        <Grid item md={4} xs={12}>
                            <Field
                                name='gpa'
                                label='GPA'
                                component={TextFormField}
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
    );
}

export default StudentProfileForm;
