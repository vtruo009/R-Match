import React from 'react';
import { useParams } from 'react-router-dom';

import ApplicantsList from 'Domains/Jobs/ApplicantsList';

interface JobApplicantsParams {
    jobId: string;
}

function JobApplicants() {
    const params = useParams<JobApplicantsParams>();
    return <ApplicantsList jobId={parseInt(params.jobId)} />;
}

export default JobApplicants;
