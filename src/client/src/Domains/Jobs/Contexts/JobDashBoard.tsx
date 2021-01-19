import React from 'react';

interface JobStateHandlers {
    removeJob: (jobToRemoveId: number) => void;
}

const defaultFunctions: JobStateHandlers = {
    removeJob: (jobToRemoveId: number) => {},
};

export default React.createContext<JobStateHandlers>(defaultFunctions);