import React from 'react';
import AddIcon from '@material-ui/icons/Add';

import Button from 'Components/Button';
import JobsContext from '../Contexts/JobsContext';
import useApi from 'hooks/useApi';
import useSnack from 'hooks/useSnack';
import useDialog from 'hooks/useDialog';
import JobBaseForm, { IJobBaseFormValues } from 'Domains/Jobs/JobBaseForm';
import { createJob } from '../api';
import { formatDateString } from 'utils/format';

export type IJobCreateFormValues = IJobBaseFormValues;

const jobCreateFormInitialValues = {
    title: '',
    description: '',
    hoursPerWeek: undefined,
    minSalary: undefined,
    maxSalary: undefined,
    targetYears: [],
    type: [],
    startDate: '',
    endDate: undefined,
    expirationDate: formatDateString(
        new Date(new Date().setFullYear(new Date().getFullYear() + 2)).toLocaleDateString(),
        'yyyy-MM-dd'
    ),
    collegeId: undefined,
    departmentId: undefined,
};

function JobCreateForm() {
    const [
        jobInitialValues,
        setJobInitialValues,
    ] = React.useState<IJobCreateFormValues>(jobCreateFormInitialValues);
    const { addJob } = React.useContext(JobsContext);
    const { openDialog, closeDialog, DialogProps, Dialog } = useDialog();
    const [snack] = useSnack();
    const request = React.useCallback(() => createJob(jobInitialValues), [
        jobInitialValues,
    ]);
    const [sendRequest, isLoading] = useApi(request, {
        onSuccess: () => {
            closeDialog();
            // TODO: This function currently sends a request to get all the jobs from sever again.
            //      find a better way of adding a job without sending a request to update the current list of jobs
            addJob();
            snack('Job successfully created', 'success');
        },
    });

    return (
        <div>
            <Button
                variant='outlined'
                startIcon={<AddIcon />}
                onClick={openDialog}
            >
                Add
            </Button>
            <Dialog {...DialogProps} title='Post Job'>
                <JobBaseForm
                    onSubmit={(jobBaseValues) => {
                        setJobInitialValues(jobBaseValues);
                        sendRequest();
                    }}
                    jobInitialValues={jobCreateFormInitialValues}
                    onCancel={closeDialog}
                    isLoading={isLoading}
                />
            </Dialog>
        </div>
    );
}

export default JobCreateForm;
