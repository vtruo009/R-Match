import React from 'react';
import Grid from '@material-ui/core/Grid';
import CloseIcon from '@material-ui/icons/Close';
import OpenIcon from '@material-ui/icons/Replay';
import ApplyIcon from '@material-ui/icons/ArrowUpward';
import { Link } from 'react-router-dom';
import MUIButton from '@material-ui/core/Button';
import Badge from '@material-ui/core/Badge';
import ApplicantIcon from '@material-ui/icons/PersonOutline';

import useApi from 'hooks/useApi';
import useSnack from 'hooks/useSnack';
import { formatDateString } from 'utils/format';
import JobsContext from '../Contexts/JobsContext';
import DeleteButton from 'Components/DeleteButton';
import Button from 'Components/Button';
import {
    IJob,
    deleteJob,
    closeJob,
    openJob,
    applyToJob,
    getNumberOfApplicants,
} from 'Domains/Jobs/api';
import JobUpdateForm from 'Domains/Jobs/JobUpdateForm';

interface JobActionsProps {
    job: IJob;
    hasPermission: boolean;
}

function JobActions({ job, hasPermission }: JobActionsProps) {
    const [numOfApplicants, setNumOfApplicants] = React.useState<number>(0);

    const getJobDescriptionForDelete = () => {
        const { title, postedOn } = job;
        return `Please confirm the deletion of the job "${title}", posted on: ${formatDateString(
            postedOn
        )}. All applications attached to this job will also be deleted.`;
    };
    const [snack] = useSnack();
    const { removeJob, updateJobStatus, showApply } = React.useContext(
        JobsContext
    );
    const deleteRequest = React.useCallback(() => deleteJob(job.id), [job.id]);
    const closeRequest = React.useCallback(() => closeJob(job.id), [job.id]);
    const openRequest = React.useCallback(() => openJob(job.id), [job.id]);
    const applyRequest = React.useCallback(() => applyToJob(job.id), [job.id]);
    const getNumOfApplicantsRequest = React.useCallback(
        () => getNumberOfApplicants(job.id),
        [job.id]
    );

    const [sendCloseRequest, isCloseRequestLoading] = useApi(closeRequest, {
        onSuccess: () => {
            updateJobStatus(job.id, 'Closed');
            snack('Job successfully closed', 'success');
        },
    });

    const [sendOpenRequest, isOpenRequestLoading] = useApi(openRequest, {
        onSuccess: () => {
            updateJobStatus(job.id, 'Hiring');
            snack('Job successfully opened', 'success');
        },
    });

    const [sendApplyRequest, isApplyRequestLoading] = useApi(applyRequest, {
        onSuccess: () => {
            removeJob(job.id);
            snack('Application successfully submitted', 'success');
        },
        onFailure: (error, response) => {
            console.log(error);
            if (response) {
                snack(`${response.data.message}`, 'error');
            } else {
                snack('Something went wrong. Try again later!', 'error');
            }
        },
    });

    const [sendGetNumOfApplicantsRequest] = useApi(getNumOfApplicantsRequest, {
        onSuccess: (result) =>
            setNumOfApplicants(result.data.numberOfApplicants),
    });

    React.useEffect(() => {
        if (hasPermission) sendGetNumOfApplicantsRequest();
    }, [hasPermission, sendGetNumOfApplicantsRequest, job.id]);

    return hasPermission ? (
        <Grid container spacing={2}>
            <Grid item>
                {job.status === 'Hiring' ? (
                    <Button
                        onClick={sendCloseRequest}
                        disabled={isCloseRequestLoading}
                        variant='outlined'
                        startIcon={<CloseIcon />}
                    >
                        Close
                    </Button>
                ) : (
                    <Button
                        onClick={sendOpenRequest}
                        disabled={isOpenRequestLoading}
                        variant='outlined'
                        startIcon={<OpenIcon />}
                    >
                        Open
                    </Button>
                )}
            </Grid>
            <Grid item>
                <MUIButton
                    color='primary'
                    variant='outlined'
                    startIcon={
                        <Badge
                            badgeContent={numOfApplicants}
                            color='primary'
                            showZero
                        >
                            <ApplicantIcon />
                        </Badge>
                    }
                    component={Link}
                    to={`/job-applicants/${job.title}/${job.id}`}
                >
                    Applicants
                </MUIButton>
            </Grid>
            <Grid item>
                <JobUpdateForm
                    jobInitialValues={{
                        id: job.id,
                        title: job.title,
                        description: job.description,
                        hoursPerWeek: job.hoursPerWeek,
                        minSalary: job.minSalary,
                        maxSalary: job.maxSalary,
                        targetYears: job.targetYears,
                        type: job.type,
                        startDate: formatDateString(
                            job.startDate,
                            'yyyy-MM-dd'
                        ),
                        endDate: formatDateString(job.endDate, 'yyyy-MM-dd'),
                        expirationDate: formatDateString(
                            job.expirationDate,
                            'yyyy-MM-dd'
                        ),
                        collegeId: job.department.college.id,
                        departmentId: job.department.id,
                    }}
                />
            </Grid>
            <Grid item>
                <DeleteButton
                    message={getJobDescriptionForDelete()}
                    onDeleteRequest={deleteRequest}
                    onSuccess={() => removeJob(job.id)}
                />
            </Grid>
        </Grid>
    ) : showApply ? (
        <Button
            onClick={sendApplyRequest}
            disabled={isApplyRequestLoading}
            size='small'
            variant='outlined'
            startIcon={<ApplyIcon />}
        >
            Apply
        </Button>
    ) : (
        <> </>
    );
}

export default JobActions;
