import React from 'react';

import { IStudent } from 'Domains/Student/api';
import StudentsList from 'Domains/Student/StudentsList';

interface ApplicantsListProps {
    jobId: number;
}

function ApplicantsList({ jobId }: ApplicantsListProps) {
    const [applicants, setApplicants] = React.useState<IStudent[]>([]);

    return applicants.length > 0 ? (
        <StudentsList students={applicants}></StudentsList>
    ) : (
        <> </>
    );
}

export default ApplicantsList;
