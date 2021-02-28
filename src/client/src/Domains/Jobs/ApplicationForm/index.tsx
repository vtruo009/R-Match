import React from 'react';
import { Formik, Form, Field } from 'formik';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import useApi from 'hooks/useApi';
import useSnack from 'hooks/useSnack';
import Loader from 'Components/Loader';
import SubmitButton from 'Components/SubmitButton';
import { SelectFormField, IOptions } from 'Components/SelectFormField';
import { getDocuments } from '../../Documents/api';
import { applyToJob } from 'Domains/Jobs/api';
import JobsContext from '../Contexts/JobsContext';

interface ApplicationFormProps {
    jobId: number;
    onSubmit?: () => void;
}

interface IApplicationForm {
    resumeId?: number;
    transcriptId?: number;
}

const initialFormValues: IApplicationForm = {
    resumeId: undefined,
    transcriptId: undefined,
};

function ApplicationForm({ jobId, onSubmit }: ApplicationFormProps) {
    const { removeJob, onApply } = React.useContext(JobsContext);
    const [snack] = useSnack();
    const [resumesData, setResumesData] = React.useState<IOptions>([]);
    const [transcriptsData, setTranscriptsData] = React.useState<IOptions>([]);
    const [formData, setFormData] = React.useState<IApplicationForm>(
        initialFormValues
    );
    const applyRequest = React.useCallback(
        () => applyToJob(jobId, formData.resumeId, formData.transcriptId),
        [jobId, formData]
    );
    const [sendApplyRequest, isApplyRequestLoading] = useApi(applyRequest, {
        onSuccess: () => {
            removeJob(jobId);
            onApply();
            if (onSubmit) onSubmit();
            snack('Application successfully submitted', 'success');
        },
        onFailure: (error, response) => {
            console.log(error);
            if (response) {
                snack(`${response.data.error}`, 'error');
            } else {
                snack('Something went wrong. Try again later!', 'error');
            }
        },
    });

    const getDocumentsRequest = React.useCallback(() => getDocuments(), []);

    const [sendGetDocumentsRequest, isGettingDocumentsLoading] = useApi(
        getDocumentsRequest,
        {
            onSuccess: (response) => {
                const { resumes, transcripts } = response.data.documents;
                setResumesData(
                    resumes.map((resume) => ({
                        label: resume.name,
                        value: resume.id,
                    }))
                );
                setTranscriptsData(
                    transcripts.map((transcript) => ({
                        label: transcript.name,
                        value: transcript.id,
                    }))
                );
            },
        }
    );

    React.useEffect(() => sendGetDocumentsRequest(), [sendGetDocumentsRequest]);

    if (isGettingDocumentsLoading) return <Loader />;

    return (
        <Formik
            initialValues={initialFormValues}
            onSubmit={(formValues) => {
                setFormData(formValues);
                sendApplyRequest();
            }}
        >
            {() => (
                <Form>
                    <Grid container spacing={5} justify='center'>
                        <Grid item xs={12}>
                            <Typography variant='body1'>
                                Select which documents you would like to attach
                                to your application. If you don't select any
                                document, your default documents will be
                                attached to the application.
                            </Typography>
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <Field
                                name='resumeId'
                                label='Resume'
                                options={resumesData}
                                component={SelectFormField}
                                defaultLabel='Select a resume'
                            />
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <Field
                                name='transcriptId'
                                label='Transcript'
                                options={transcriptsData}
                                component={SelectFormField}
                                defaultLabel='Select a transcript'
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <SubmitButton
                                isLoading={isApplyRequestLoading}
                                fullWidth
                            />
                        </Grid>
                    </Grid>
                </Form>
            )}
        </Formik>
    );
}

export default ApplicationForm;
