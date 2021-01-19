import React from 'react';
import { AxiosResponse } from 'axios';
import Grid from '@material-ui/core/Grid';
import { Formik, Form, Field } from 'formik';
import * as yup from 'yup';

import useApi from 'hooks/useApi';
import useSnack from 'hooks/useSnack';
import { TextFormField } from 'Components/TextFormField';
import { SelectFormField } from 'Components/SelectFormField';
import { DatePickerFormField } from 'Components/DatePickerFormField';
import SubmitButton from 'Components/SubmitButton';
import CancelButton from 'Components/CancelButton';
import { targetYears, jobTypes } from 'Domains/Jobs/api';
import AcademicInfo from 'Components/AcademicInfo';
import { IJobCreateFormValues } from 'Domains/Jobs/JobCreateForm';
import { IJobUpdateFormValues } from 'Domains/Jobs/JobUpdateForm';

// TODO FIGURE OUT WHY START DATE CAN'T BE TODAY
const today = new Date();
const formSchema = yup.object({
    title: yup.string().required('Title is required'),
    type: yup.array().required('At least one job type is required'),
    description: yup.string().required('Description is required'),
    startDate: yup
        .date()
        .min(today, `Start date must be later than today`)
        .required('Start date is required'),
    endDate: yup
        .date()
        .min(yup.ref('startDate'), 'End date must be later than start date')
        .optional(),
    expirationDate: yup
        .date()
        .min(
            yup.ref('startDate'),
            'Expiration date must be later than start date'
        )
        .optional(),
    hoursPerWeek: yup
        .number()
        .moreThan(0, 'Hours per week must be greater than 0')
        .required('Hours per week is required'),
    minSalary: yup
        .number()
        .min(0, 'Minimum salary must be greater than or equal to zero')
        .required('Minimum salary is required'),
    maxSalary: yup
        .number()
        .min(
            yup.ref('minSalary'),
            'Maximum salary must be greater or equal to minimum salary'
        )
        .optional(),
    collegeId: yup.number().required('College is required'),
    departmentId: yup.number().required('Department is required'),
    targetYears: yup.array().required('At least one targe year is required'),
});

interface formValuesTypes<T> {
    requestFunction: (job: T) => Promise<AxiosResponse<any>>;
    jobInitialValues: T;
}

// TODO: Fix, not best practice
type JobFormValues = any;

interface JobFormProps {
    onSuccess: () => void;
    onCancel: () => void;
    formValues: formValuesTypes<JobFormValues>;
    successMessage: string;
}

function JobForm({
    onSuccess,
    onCancel,
    formValues: { requestFunction, jobInitialValues },
    successMessage,
}: JobFormProps) {
    const [jobFormValues, setJob] = React.useState<JobFormValues>(
        jobInitialValues
    );
    const request = React.useCallback(() => requestFunction(jobFormValues), [
        jobFormValues,
        requestFunction,
    ]);
    const [snack] = useSnack();
    const [sendRequest, isLoading] = useApi(request, {
        onSuccess: () => {
            onSuccess();
            snack(successMessage, 'success');
        },
    });
    return (
        <Formik
            validationSchema={formSchema}
            initialValues={jobInitialValues}
            onSubmit={(formValues) => {
                setJob(formValues);
                sendRequest();
            }}
        >
            {() => (
                <Form>
                    <Grid
                        container
                        spacing={5}
                        alignItems='center'
                        justify='center'
                    >
                        <Grid item md={12} xs={12}>
                            <Field
                                name='title'
                                label='Title'
                                component={TextFormField}
                            />
                        </Grid>
                        <Grid item md={12} xs={12}>
                            <Field
                                name='description'
                                label='Description'
                                multiline
                                component={TextFormField}
                            />
                        </Grid>
                        <Grid item md={4} xs={12}>
                            <Field
                                name='startDate'
                                label='Start date'
                                component={DatePickerFormField}
                            />
                        </Grid>
                        <Grid item md={4} xs={12}>
                            <Field
                                name='endDate'
                                label='End date'
                                component={DatePickerFormField}
                            />
                        </Grid>
                        <Grid item md={4} xs={12}>
                            <Field
                                name='expirationDate'
                                label='Expiration date'
                                component={DatePickerFormField}
                            />
                        </Grid>
                        <Grid item md={4} xs={12}>
                            <Field
                                name='type'
                                label='Type'
                                options={jobTypes}
                                multiple
                                component={SelectFormField}
                            />
                        </Grid>
                        <Grid item md={4} xs={12}>
                            <Field
                                name='hoursPerWeek'
                                label='Hours per week'
                                type='number'
                                component={TextFormField}
                            />
                        </Grid>
                        <Grid item md={4} xs={12}>
                            <Field
                                name='targetYears'
                                label='Target years'
                                options={targetYears}
                                multiple
                                component={SelectFormField}
                            />
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <Field
                                name='minSalary'
                                type='number'
                                label='Minimum salary ($/hr.)'
                                component={TextFormField}
                            />
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <Field
                                name='maxSalary'
                                type='number'
                                label='Maximum salary ($/hr.)'
                                component={TextFormField}
                            />
                        </Grid>
                        <Field component={AcademicInfo} />
                        <Grid item xs={6}>
                            <SubmitButton isLoading={isLoading} fullWidth />
                        </Grid>
                        <Grid item xs={6}>
                            <CancelButton onClick={onCancel} fullWidth />
                        </Grid>
                    </Grid>
                </Form>
            )}
        </Formik>
    );
}

export default JobForm;
