import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { Formik, Form, Field } from 'formik';
import * as yup from 'yup';

import useApi from 'hooks/useApi';
import useSnack from 'hooks/useSnack';
import { TextFormField } from 'Components/TextFormField';
import SubmitButton from 'Components/SubmitButton';
import AcademicInfo from 'Components/AcademicInfo';
import { updateFacultyMemberProfile } from 'Domains/FacultyMember/api';

export interface IFacultyMemberProfileForm {
    id: number;
    userId: number;
    firstName: string;
    middleName: string;
    lastName: string;
    collegeId?: number;
    departmentId?: number;
    websiteLink: string;
    office: string;
    title: string;
    email: string;
    biography: string;
}

const formInitialValues: IFacultyMemberProfileForm = {
    // TODO: Replace with actual values later
    id: 3,
    userId: 13,
    firstName: '',
    middleName: '',
    lastName: '',
    collegeId: undefined,
    departmentId: undefined,
    websiteLink: '',
    office: '',
    title: '',
    email: '',
    biography: '',
};

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

function FacultyMemberProfileForm() {
    const [
        facultyMemberProfile,
        setFacultyMemberProfile,
    ] = React.useState<IFacultyMemberProfileForm>(formInitialValues);
    const request = React.useCallback(
        () => updateFacultyMemberProfile(facultyMemberProfile),
        [facultyMemberProfile]
    );
    const [snack] = useSnack();
    const [sendRequest, isLoading] = useApi(request, {
        onSuccess: () => {
            snack('Faculty member profile successfully updated!', 'success');
        },
    });
    return (
        <Paper style={{ padding: 80 }}>
            <Formik
                validationSchema={formSchema}
                initialValues={formInitialValues}
                onSubmit={(formValues) => {
                    setFacultyMemberProfile(formValues);
                    sendRequest();
                }}
            >
                {() => (
                    <Form>
                        <Grid container spacing={5} alignItems='center'>
                            <Grid item xs={12}>
                                <Typography variant='h4'>
                                    Faculty Member Profile
                                </Typography>
                            </Grid>
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
                            <Grid item xs={12}>
                                <SubmitButton isLoading={isLoading} />
                            </Grid>
                        </Grid>
                    </Form>
                )}
            </Formik>
        </Paper>
    );
}

export default FacultyMemberProfileForm;
