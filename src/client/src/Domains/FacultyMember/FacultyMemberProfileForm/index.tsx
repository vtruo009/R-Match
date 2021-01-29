import React from 'react';
import Grid from '@material-ui/core/Grid';
import { Formik, Form, Field } from 'formik';
import * as yup from 'yup';

import useApi from 'hooks/useApi';
import useSnack from 'hooks/useSnack';
import { TextFormField } from 'Components/TextFormField';
import SubmitButton from 'Components/SubmitButton';
import AcademicInfo from 'Components/AcademicInfo';
import CancelButton from 'Components/CancelButton';
import { updateFacultyMemberProfile } from 'Domains/FacultyMember/api';

export interface IFacultyMemberProfileForm {
    id: number;
    userId: number;
    firstName: string;
    middleName?: string;
    lastName: string;
    collegeId?: number;
    departmentId?: number;
    websiteLink?: string;
    office?: string;
    title?: string;
    email: string;
    biography?: string;
}

interface FacultyMemberProfileFormProps {
    facultyMemberProfileInformation: IFacultyMemberProfileForm;
    onClose: () => void;
    onSuccess: () => void;
}

const formSchema = yup.object({
    firstName: yup.string().required('First name is required'),
    middleName: yup.string().optional().nullable(),
    lastName: yup.string().required('Last name is required'),
    collegeId: yup.number().optional().nullable(),
    departmentId: yup.number().optional().nullable(),
    websiteLink: yup.string().optional().nullable(),
    office: yup.string().optional().nullable(),
    title: yup.string().optional().nullable(),
    biography: yup.string().optional().nullable(),
});

function FacultyMemberProfileForm({
    facultyMemberProfileInformation,
    onClose,
    onSuccess,
}: FacultyMemberProfileFormProps) {
    const [
        facultyMemberProfileForm,
        setFacultyMemberProfile,
    ] = React.useState<IFacultyMemberProfileForm>(
        facultyMemberProfileInformation
    );
    const updateProfileRequest = React.useCallback(
        () => updateFacultyMemberProfile(facultyMemberProfileForm),
        [facultyMemberProfileForm]
    );
    const [snack] = useSnack();
    const [sendUpdateProfileRequest, isUpdateProfileLoading] = useApi(
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
            initialValues={facultyMemberProfileInformation}
            onSubmit={(formValues) => {
                setFacultyMemberProfile(formValues);
                sendUpdateProfileRequest();
            }}
        >
            {() => (
                <Form>
                    <Grid container spacing={5} alignItems='center'>
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
                        <Grid item md={12} xs={12}>
                            <Field
                                name='biography'
                                label='Biography'
                                multiline
                                component={TextFormField}
                            />
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <Field
                                name='websiteLink'
                                label='Website Link'
                                component={TextFormField}
                            />
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <Field
                                name='office'
                                label='Office'
                                component={TextFormField}
                            />
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <Field
                                name='title'
                                label='Title'
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
                        <Field component={AcademicInfo} />
                        <Grid item md={6} xs={12}>
                            <SubmitButton
                                fullWidth
                                isLoading={isUpdateProfileLoading}
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

export default FacultyMemberProfileForm;
