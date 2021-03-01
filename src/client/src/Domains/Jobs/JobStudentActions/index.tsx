import React from 'react';
import ApplyIcon from '@material-ui/icons/Publish';
import WithdrawIcon from '@material-ui/icons/Cancel';
import Grid from '@material-ui/core/Grid';

import CancelButton from 'Components/CancelButton';
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
    const applicationDialog = useDialog();
    const withdrawDialog = useDialog();
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
                withdrawDialog.closeDialog();
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
            <Button
                onClick={applicationDialog.openDialog}
                startIcon={<ApplyIcon />}
            >
                Apply
            </Button>
            <applicationDialog.Dialog
                {...applicationDialog.DialogProps}
                title='Select Documents'
            >
                <ApplicationForm
                    jobId={jobId}
                    onSubmit={applicationDialog.closeDialog}
                />
            </applicationDialog.Dialog>
        </>
    ) : (
        <>
            <Button
                onClick={withdrawDialog.openDialog}
                startIcon={<WithdrawIcon />}
            >
                Withdraw
            </Button>
            <withdrawDialog.Dialog
                {...withdrawDialog.DialogProps}
                title='Please confirm withdrawal of job application'
            >
                <Grid container spacing={3}>
                    <Grid item xs={6}>
                        <Button
                            onClick={sendWithdrawFromJobRequest}
                            fullWidth
                            disabled={isWithdrawFromRequestLoading}
                        >
                            Confirm
                        </Button>
                    </Grid>
                    <Grid item xs={6}>
                        <CancelButton
                            onClick={withdrawDialog.closeDialog}
                            fullWidth
                        >
                            Confirm
                        </CancelButton>
                    </Grid>
                </Grid>
            </withdrawDialog.Dialog>
        </>
    );
}

export default JobStudentActions;
