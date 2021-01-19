import React from 'react';

import JobForm from 'Domains/Jobs/JobForm';
import EditButton from 'Components/EditButton';
import useDialog from 'hooks/useDialog';
import { IJob, updateJob } from '../api';

export type IJobUpdateFormValues = IJob;

interface JobUpdateFormProps {
    job: IJobUpdateFormValues;
}

function JobUpdateForm({ job }: JobUpdateFormProps) {
    const [, openDialog, closeDialog, DialogProps, Dialog] = useDialog();
    return (
        <>
            <EditButton onClick={openDialog} />
            <Dialog {...DialogProps} title='Update Job'>
                <JobForm
                    onSuccess={closeDialog}
                    onCancel={closeDialog}
                    successMessage='Job successfully updated'
                    formValues={{
                        requestFunction: updateJob,
                        jobInitialValues: job,
                    }}
                />
            </Dialog>
        </>
    );
}

export default JobUpdateForm;
