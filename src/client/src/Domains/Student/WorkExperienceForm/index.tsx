import React from 'react';
import { AxiosResponse } from 'axios';
import Grid from '@material-ui/core/Grid';
import { Formik, Form, Field } from 'formik';
import * as yup from 'yup';

import useApi from 'hooks/useApi';
import useSnack from 'hooks/useSnack';
import { DatePickerFormField } from 'Components/DatePickerFormField';
import { TextFormField } from 'Components/TextFormField';
import SubmitButton from 'Components/SubmitButton';
import CancelButton from 'Components/CancelButton';
import { IWorkExperience } from '../api';

interface WorkExperienceFormProps {
    workExperienceInitialValues: IWorkExperience;
    apiFunction: (
        workExperience: IWorkExperience
    ) => Promise<AxiosResponse<unknown>>;
    onCancel: () => void;
    onSuccess: () => void;
}

const today = new Date();
const formSchema = yup.object({
    title: yup.string().required('Title is required'),
    startDate: yup
        .date()
        .min(today, `Start date must be later than today`)
        .required('Start date is required'),
    endDate: yup
        .date()
        .min(yup.ref('startDate'), 'End date must be later than start date')
        .optional()
        .nullable(),
    employer: yup.string().required('Employer name is required'),
    description: yup.string().required('Work description is required'),
});

function WorkExperienceForm({
    workExperienceInitialValues,
    apiFunction,
    onSuccess,
    onCancel,
}: WorkExperienceFormProps) {
    const [
        WorkExperienceInformation,
        setWorkExperienceInformation,
    ] = React.useState<IWorkExperience>(workExperienceInitialValues);
    const [snack] = useSnack();
    const updateWorkExperienceRequest = React.useCallback(
        () => apiFunction(WorkExperienceInformation),
        [WorkExperienceInformation, apiFunction]
    );
    const [
        sendUpdateWorkExperienceRequest,
        isUpdatingWorkExperienceLoading,
    ] = useApi(updateWorkExperienceRequest, {
        onSuccess: () => {
            onSuccess();
            snack('Work experience successfully updated', 'success');
        },
    });
    return (
        <Formik
            validationSchema={formSchema}
            initialValues={WorkExperienceInformation}
            onSubmit={(formValues) => {
                setWorkExperienceInformation(formValues);
                sendUpdateWorkExperienceRequest();
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
                        <Grid item md={4} xs={12}>
                            <Field
                                name='description'
                                label='description'
                                component={TextFormField}
                            />
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <SubmitButton
                                fullWidth
                                isLoading={isUpdatingWorkExperienceLoading}
                            />
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
