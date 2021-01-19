import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';

import JobForm from 'Domains/Jobs/JobForm';
import Dialog from 'Components/Dialog';
import { createJob, jobType } from '../api';

export interface IJobCreateFormValues {
    title: string;
    type: jobType[];
    description: string;
    startDate: string;
    endDate?: string;
    expirationDate?: string;
    hoursPerWeek?: number;
    minSalary?: number;
    maxSalary?: number;
    collegeId?: number;
    departmentId?: number;
    targetYears: string[];
}

const jobInitialValues: IJobCreateFormValues = {
    title: '',
    type: [],
    description: '',
    startDate: '',
    endDate: undefined,
    expirationDate: undefined,
    hoursPerWeek: undefined,
    minSalary: undefined,
    maxSalary: undefined,
    collegeId: undefined,
    departmentId: undefined,
    targetYears: [],
};

interface JobCreateFormProps {
    onSuccess: () => void;
}

function JobCreateForm({ onSuccess }: JobCreateFormProps) {
    const [open, setOpen] = React.useState(false);
    return (
        <div>
            <IconButton color='primary' onClick={() => setOpen(true)}>
                <AddIcon />
            </IconButton>
            <Dialog title='Post Job' open={open} onClose={() => setOpen(false)}>
                <JobForm
                    onSuccess={() => {
                        onSuccess();
                        setOpen(false);
                    }}
                    onCancel={() => setOpen(false)}
                    successMessage='Job successfully created'
                    formValues={{
                        requestFunction: createJob,
                        jobInitialValues,
                    }}
                />
            </Dialog>
        </div>
    );
}

export default JobCreateForm;
