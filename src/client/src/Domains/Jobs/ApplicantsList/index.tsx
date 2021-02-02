import React from 'react';

import useApi from 'hooks/useApi';
import useSnack from 'hooks/useSnack';
import Loader from 'Components/Loader';
import { getJobApplicants } from 'Domains/Jobs/api';
import { IStudentPreview } from 'Domains/Student/api';
import StudentsList from 'Domains/Student/StudentsList';

interface ApplicantsListProps {
    jobId: number;
}

function ApplicantsList({ jobId }: ApplicantsListProps) {
    const [applicants, setApplicants] = React.useState<IStudentPreview[]>([]);
    const request = React.useCallback(() => getJobApplicants(jobId, 0, 0), [
        jobId,
    ]);
    const [snack] = useSnack();
    const [sendRequest, isLoading] = useApi(request, {
        onSuccess: (response) => {
            const jobApplicants = response.data.jobApplicants;
            if (jobApplicants.length > 0) {
                const studentPreviews = response.data.jobApplicants.map(
                    (jobApplicants) => jobApplicants.student
                );
                setApplicants(studentPreviews);
            } else {
                snack('No applicants were found', 'warning');
            }
        },
    });

    React.useEffect(() => sendRequest(), [sendRequest]);

    return isLoading ? (
        <Loader center />
    ) : applicants.length > 0 ? (
        <StudentsList studentPreviews={applicants}></StudentsList>
    ) : (
        <></>
    );
}

export default ApplicantsList;
