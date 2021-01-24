import React from 'react';
import { statusType } from '../api';
import { IJobUpdateFormValues } from '../JobUpdateForm';

interface JobStateHandlers {
    removeJob: (jobToRemoveId: number) => void;
    addJob: () => void;
    updateJob: (updatedJob: IJobUpdateFormValues) => void;
    updateJobStatus: (jobId: number, newStatus: statusType) => void;
    showApply: boolean;
}

export const defaultJobStateHandlers: JobStateHandlers = {
    removeJob: (jobToRemoveId: number) => {},
    // TODO: Figure out a better way to add a job instead of re-sending a request
    addJob: () => {},
    updateJob: (updatedJob: IJobUpdateFormValues) => {},
    updateJobStatus: (jobId: number, newStatus: statusType) => {},
    showApply: true,
};

export default React.createContext<JobStateHandlers>(defaultJobStateHandlers);
