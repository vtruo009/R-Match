import React from 'react';

import { IStudentPreview } from 'Domains/Student/api';
import StudentsList from 'Domains/Student/StudentsList';

interface ApplicantsListProps {
    jobId: number;
}

function ApplicantsList({ jobId }: ApplicantsListProps) {
    const [applicants, setApplicants] = React.useState<IStudentPreview[]>([]);

    return applicants.length > 0 ? (
        <StudentsList studentPreviews={applicants}></StudentsList>
    ) : (
        <> </>
    );
}

export default ApplicantsList;
