import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { Formik, Form, Field } from 'formik';
import * as yup from 'yup';

import useApi from 'hooks/useApi';
import useSnack from 'hooks/useSnack';
import { TextFormField } from 'Components/TextFormField';
import { SelectFormField } from 'Components/SelectFormField';
import SubmitButton from 'Components/SubmitButton';
import { createFacultyMemberProfile } from 'Domains/FacultyMember/api/api';

import { departments } from 'sharedData';

export interface IFacultyMemberProfileForm {
    firstName: string;
    middleName: string;
    lastName: string;
    departmentId: string;
    websiteLink: string;
    office: string;
    title: string;
    email: string;
    biography: string;
}

const formInitialValues: IFacultyMemberProfileForm = {
    firstName: '',
    middleName: '',
    lastName: '',
    departmentId: '',
    websiteLink: '',
    office: '',
    title: '',
    email: '',
    biography: '',
};

const formSchema = yup.object({
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    departmentId: yup.string().required('Department is required'),
    websiteLink: yup.string().required('Website link is required'),
    office: yup.string().required('Office location is required'),
    title: yup.string().required('Title is required'),
    email: yup
        .string()
        .required('Email is required')
        .email('Please enter valid email'),
    biography: yup.string().required('Biography is required'),
});

function FacultyMemberProfileForm() {
    const [
        facultyMemberProfile,
        setFacultyMemberProfile,
    ] = React.useState<IFacultyMemberProfileForm>(formInitialValues);
    const request = React.useCallback(
        () => createFacultyMemberProfile(facultyMemberProfile),
        [facultyMemberProfile]
    );
    const [snack] = useSnack();
    const [sendRequest, isLoading] = useApi(request, {
        onSuccess: () => {
            snack('Faculty member profile successfully created!', 'success');
        },
    });
    return (
        <Paper style={{ padding: 50 }}>
            <Formik
                validationSchema={formSchema}
                initialValues={formInitialValues}
                onSubmit={(formValues, actions) => {
                    setFacultyMemberProfile(formValues);
                    sendRequest();
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
                                    Faculty Member Profile
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
                                        name='departmentId'
                                        label='Department'
                                        options={departments}
                                        component={SelectFormField}
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <Field
                                        name='websiteLink'
                                        label='Website Link'
                                        component={TextFormField}
                                    />
                                </Grid>
                                <Grid item md={4} xs={12}>
                                    <Field
                                        name='office'
                                        label='Office'
                                        component={TextFormField}
                                    />
                                </Grid>
                                <Grid item md={4} xs={12}>
                                    <Field
                                        name='title'
                                        label='Title'
                                        component={TextFormField}
                                    />
                                </Grid>
                                <Grid item md={4} xs={12}>
                                    <Field
                                        name='email'
                                        label='Email'
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
                            </Grid>
                            <Grid container item xs={12}>
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
