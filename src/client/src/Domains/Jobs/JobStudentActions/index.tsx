import React from 'react';
import ApplyIcon from '@material-ui/icons/ArrowUpward';
import WithdrawIcon from '@material-ui/icons/RemoveCircle';

import useApi from 'hooks/useApi';
import useSnack from 'hooks/useSnack';
import useDialog from 'hooks/useDialog';
import JobsContext from '../Contexts/JobsContext';
import Button from 'Components/Button';
import ApplicationForm from '../ApplicationForm';
import { withdrawFromJob } from 'Domains/Jobs/api';

interface JobStudentActionsProps {
    jobId: number;
}

function JobStudentActions({ jobId }: JobStudentActionsProps) {
    const [snack] = useSnack();
    const { openDialog, closeDialog, DialogProps, Dialog } = useDialog();
    const { showApply, removeJob } = React.useContext(JobsContext);
    const withDrawFromJobRequest = React.useCallback(
        () => withdrawFromJob(jobId),
        [jobId]
    );

    const [sendWithdrawFromJobRequest, isWithdrawFromRequestLoading] = useApi(
        withDrawFromJobRequest,
        {
            onSuccess: () => {
                removeJob(jobId);
                snack('Application successfully withdrawn', 'success');
            },
            onFailure: (error, response) => {
                console.log(error);
                if (response) {
                    snack(`${response.data.error}`, 'error');
                } else {
                    snack('Something went wrong. Try again later!', 'error');
                }
            },
        }
    );

    return showApply ? (
        <>
            <Button onClick={openDialog} startIcon={<ApplyIcon />}>
                Apply
            </Button>
            <Dialog {...DialogProps} title='Select Documents'>
                <ApplicationForm jobId={jobId} onSubmit={closeDialog} />
            </Dialog>
        </>
    ) : (
        <Button
            onClick={sendWithdrawFromJobRequest}
            disabled={isWithdrawFromRequestLoading}
            startIcon={<WithdrawIcon />}
        >
            Withdraw
        </Button>
    );
}

export default JobStudentActions;
