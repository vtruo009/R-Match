import React from 'react';

import useApi from 'hooks/useApi';
import JobResultsCarousel from 'Domains/Jobs/JobResultsCarousel';
import { IJob, getRecommendedJobs } from '../api';

function RecommendedJobs() {
    const [recommendedJobs, setRecommendedJobs] = React.useState<IJob[]>([]);
    const request = React.useCallback(() => getRecommendedJobs(), []);
    const [sendRequest] = useApi(request, {
        onSuccess: (results) => {
            setRecommendedJobs(results.data.recommendedJobs);
        },
    });
    React.useEffect(() => sendRequest(), [sendRequest]);
    return (
        <JobResultsCarousel jobs={recommendedJobs} title='Recommended Jobs' />
    );
}

export default RecommendedJobs;
