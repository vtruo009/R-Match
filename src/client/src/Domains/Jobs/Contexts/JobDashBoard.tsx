import React from 'react';

interface JobStateHandlers {
    removeJob: (jobToRemoveId: number) => void;
    addJob: () => void;
}

const defaultFunctions: JobStateHandlers = {
    removeJob: (jobToRemoveId: number) => {},
    // TODO: Figure out a better way to add a job instead of re-sending a request
    addJob: () => {},
};

export default React.createContext<JobStateHandlers>(defaultFunctions);
