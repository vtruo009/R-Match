import React from 'react';

import useApi from 'hooks/useApi';
import JobResultsCarousel from 'Domains/Jobs/JobResultsCarousel';
import { IJob, getNewJobs } from '../api';

function NewJobs() {
    const [newJobs, setNewJobs] = React.useState<IJob[]>([]);
    const request = React.useCallback(() => getNewJobs(), []);
    const [sendRequest] = useApi(request, {
        onSuccess: (results) => {
            setNewJobs(results.data.newJobs);
        },
    });
    React.useEffect(() => sendRequest(), [sendRequest]);
    return <JobResultsCarousel jobs={newJobs} title='New Jobs' />;
}

export default NewJobs;
