import React from 'react';

import JobResultsCarousel from 'Domains/Jobs/JobResultsCarousel';
import { getNewJobs } from '../api';

function NewJobs() {
    const request = React.useCallback(() => getNewJobs(), []);
    return <JobResultsCarousel request={request} title='New Jobs' />;
}

export default NewJobs;
