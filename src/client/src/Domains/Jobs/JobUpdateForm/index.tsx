import React from 'react';

import useApi from 'hooks/useApi';
import useSnack from 'hooks/useSnack';
import useDialog from 'hooks/useDialog';
import JobBaseForm, { IJobBaseFormValues } from 'Domains/Jobs/JobBaseForm';
import EditButton from 'Components/EditButton';
import { updateJob } from '../api';

export interface IJobUpdateFormValues extends IJobBaseFormValues {
    id: number;
}

interface JobUpdateFormProps {
    initialValues: IJobUpdateFormValues;
}

// TODO: Check date issue and update the current updated job in the page
//       Also update the delete dialog to accept a more descriptive message 
//       explaining that if a job is deleted all the job applications will also be deleted.
 
function JobUpdateForm({ initialValues }: JobUpdateFormProps) {
    const [
        jobInitialValues,
        setJobInitialValues,
    ] = React.useState<IJobUpdateFormValues>(initialValues);
    const [, openDialog, closeDialog, DialogProps, Dialog] = useDialog();
    const [snack] = useSnack();
    const request = React.useCallback(() => updateJob(jobInitialValues), [
        jobInitialValues,
    ]);
    const [sendRequest, isLoading] = useApi(request, {
        onSuccess: () => {
            closeDialog();
            // TODO: This function currently sends a request to get all the jobs from sever again.
            //      find a better way of adding a job without sending a request to update the current list of jobs
            // addJob();
            snack('Job successfully updated', 'success');
        },
    });

    React.useEffect(() => setJobInitialValues(initialValues), [initialValues]);

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
                    jobInitialValues={jobInitialValues}
                    isLoading={isLoading}
                />
            </Dialog>
        </>
    );
}

export default JobUpdateForm;
