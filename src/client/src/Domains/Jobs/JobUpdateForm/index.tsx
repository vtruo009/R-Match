import React from 'react';

import useApi from 'hooks/useApi';
import useSnack from 'hooks/useSnack';
import useDialog from 'hooks/useDialog';
import JobsContext from '../Contexts/JobsContext';
import JobBaseForm, { IJobBaseFormValues } from 'Domains/Jobs/JobBaseForm';
import EditButton from 'Components/EditButton';
import { updateJob as updateJobRequest } from '../api';

export interface IJobUpdateFormValues extends IJobBaseFormValues {
    id: number;
}

interface JobUpdateFormProps {
    jobInitialValues: IJobUpdateFormValues;
}

function JobUpdateForm({ jobInitialValues }: JobUpdateFormProps) {
    const [
        jobToUpdate,
        setJobInitialValues,
    ] = React.useState<IJobUpdateFormValues>(jobInitialValues);
    const [, openDialog, closeDialog, DialogProps, Dialog] = useDialog();
    const { updateJob } = React.useContext(JobsContext);
    const [snack] = useSnack();
    const request = React.useCallback(() => updateJobRequest(jobToUpdate), [
        jobToUpdate,
    ]);
    const [sendRequest, isLoading] = useApi(request, {
        onSuccess: () => {
            closeDialog();
            updateJob(jobToUpdate);
            snack('Job successfully updated', 'success');
        },
    });

    React.useEffect(() => setJobInitialValues(jobInitialValues), [
        jobInitialValues,
    ]);

    return (
        <>
            <EditButton onClick={openDialog} />
            <Dialog {...DialogProps} title='Update Job'>
                <JobBaseForm
                    onSubmit={(jobBaseValues) => {
                        setJobInitialValues((prevJob) => ({
                            ...jobBaseValues,
                            id: prevJob.id,
                        }));
                        sendRequest();
                    }}
                    onCancel={closeDialog}
                    jobInitialValues={jobToUpdate}
                    isLoading={isLoading}
                />
            </Dialog>
        </>
    );
}

export default JobUpdateForm;
