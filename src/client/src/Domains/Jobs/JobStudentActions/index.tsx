import React from 'react';
import ApplyIcon from '@material-ui/icons/ArrowUpward';

import useApi from 'hooks/useApi';
import useSnack from 'hooks/useSnack';
import JobsContext from '../Contexts/JobsContext';
import Button from 'Components/Button';
import { applyToJob, withdrawFromJob } from 'Domains/Jobs/api';

interface JobStudentActionsProps {
    jobId: number;
}

function JobStudentActions({ jobId }: JobStudentActionsProps) {
    const [snack] = useSnack();
    const { removeJob, showApply, onApply } = React.useContext(JobsContext);
    const applyRequest = React.useCallback(() => applyToJob(jobId), [jobId]);
    const withDrawFromJobRequest = React.useCallback(
        () => withdrawFromJob(jobId),
        [jobId]
    );

    const [sendApplyRequest, isApplyRequestLoading] = useApi(applyRequest, {
        onSuccess: () => {
            removeJob(jobId);
            onApply();
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
        <Button
            onClick={sendApplyRequest}
            disabled={isApplyRequestLoading}
            startIcon={<ApplyIcon />}
        >
            Apply
        </Button>
    ) : (
        <Button
            onClick={sendWithdrawFromJobRequest}
            disabled={isWithdrawFromRequestLoading}
        >
            Withdraw
        </Button>
    );
}

export default JobStudentActions;
