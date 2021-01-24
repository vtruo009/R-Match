import React from 'react';
import { IJobUpdateFormValues } from '../JobUpdateForm';

interface JobStateHandlers {
    removeJob: (jobToRemoveId: number) => void;
    addJob: () => void;
    updateJob: (updatedJob: IJobUpdateFormValues) => void;
}

const defaultFunctions: JobStateHandlers = {
    removeJob: (jobToRemoveId: number) => {},
    // TODO: Figure out a better way to add a job instead of re-sending a request
    addJob: () => {},
    updateJob: (updatedJob: IJobUpdateFormValues) => {},
};

export default React.createContext<JobStateHandlers>(defaultFunctions);
