import React from 'react';

import JobResultsCarousel from 'Domains/Jobs/JobResultsCarousel';
import { getRecommendedJobs } from '../api';

function RecommendedJobs() {
    const request = React.useCallback(() => getRecommendedJobs(), []);
    return <JobResultsCarousel request={request} title='Recommended Jobs' />;
}

export default RecommendedJobs;
