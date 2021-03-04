import React from 'react';
import { useParams } from 'react-router-dom';

import ApplicantsList from 'Domains/Jobs/ApplicantsList';

interface JobApplicantsParams {
    jobId: string;
    jobTitle: string;
}

function JobApplicants() {
    const { jobId, jobTitle } = useParams<JobApplicantsParams>();
    return <ApplicantsList jobId={parseInt(jobId, 10)} jobTitle={jobTitle} />;
}

export default JobApplicants;
