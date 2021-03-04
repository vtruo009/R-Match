import React from 'react';
import Grid from '@material-ui/core/Grid';
import { Formik, Form, Field } from 'formik';
import * as yup from 'yup';

import { DatePickerFormField } from 'Components/DatePickerFormField';
import { TextFormField } from 'Components/TextFormField';
import SubmitButton from 'Components/SubmitButton';
import CancelButton from 'Components/CancelButton';

export interface IWorkExperienceFormValues {
    title: string;
    description: string;
    startDate: string;
    endDate?: string;
    employer: string;
}

interface WorkExperienceFormProps {
    workExperienceInitialValues: IWorkExperienceFormValues;
    isLoading: boolean;
    onCancel: () => void;
    onSubmit: (workExperience: IWorkExperienceFormValues) => void;
}

const formSchema = yup.object({
    title: yup.string().required('Title is required'),
    startDate: yup.date().required('Start date is required'),
    endDate: yup
        .date()
        .min(yup.ref('startDate'), 'End date must be later than start date')
        .optional()
        .nullable(),
    employer: yup.string().required('Employer name is required'),
    description: yup.string().required('Description is required'),
});

function WorkExperienceForm({
    workExperienceInitialValues,
    isLoading,
    onSubmit,
    onCancel,
}: WorkExperienceFormProps) {
    return (
        <Formik
            validationSchema={formSchema}
            initialValues={workExperienceInitialValues}
            onSubmit={(formValues) => {
                onSubmit(formValues);
            }}
        >
            {() => (
                <Form>
                    <Grid
                        container
                        spacing={5}
                        justify='center'
                        alignItems='center'
                    >
                        <Grid item md={6} xs={12}>
                            <Field
                                name='title'
                                label='Title'
                                component={TextFormField}
                            />
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <Field
                                name='employer'
                                label='Employer'
                                component={TextFormField}
                            />
                        </Grid>
                        <Grid item md={12} xs={12}>
                            <Field
                                name='description'
                                label='description'
                                component={TextFormField}
                                multiline
                            />
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <Field
                                name='startDate'
                                label='Start Date'
                                component={DatePickerFormField}
                            />
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <Field
                                name='endDate'
                                label='End Date'
                                component={DatePickerFormField}
                            />
                        </Grid>

                        <Grid item md={6} xs={12}>
                            <SubmitButton fullWidth isLoading={isLoading} />
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <CancelButton onClick={onCancel} fullWidth />
                        </Grid>
                    </Grid>
                </Form>
            )}
        </Formik>
    );
}

export default WorkExperienceForm;
