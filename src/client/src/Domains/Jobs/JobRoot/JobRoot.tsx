import React from 'react';
import JobResults from '../JobResults/JobResults';
import Loader from '../../../Components/Loader/Loader';
import useApi from '../../../hooks/useApi';
import useSnack from '../../../hooks/useSnack';
import TextField from '@material-ui/core/TextField';
import { getJobs, IJob } from '../api/api';

import Button from '@material-ui/core/Button';
const dummyJobs: IJob[] = [
    {
        jobId: 1,
        targetYears: ['Junior', 'Senior'],
        hoursPerWeek: 15,
        title: 'Lab Research Assistant in Data Science',
        description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        type: 'Assistant',
        status: 'Hiring',
        minSalary: 15,
        maxSalary: 20,
        departmentId: 'Computer Science & Engineering',
    },
    {
        jobId: 2,
        targetYears: ['Freshman', 'Sophmore', 'Junior'],
        hoursPerWeek: 10,
        title: 'Grader for CS 161L',
        description:
            'Arcu odio ut sem nulla pharetra diam. Sodales neque sodales ut etiam sit. Faucibus a pellentesque sit amet porttitor eget. Purus sit amet volutpat consequat mauris nunc congue nisi vitae. Mattis aliquam faucibus purus in massa tempor nec. Lectus proin nibh nisl condimentum id venenatis a condimentum vitae. Donec massa sapien faucibus et molestie ac feugiat sed. Cursus sit amet dictum sit amet justo donec enim diam. Cras semper auctor neque vitae tempus quam pellentesque. Odio tempor orci dapibus ultrices in iaculis nunc sed. Sit amet justo donec enim diam. In fermentum posuere urna nec tincidunt praesent semper feugiat nibh. Mauris augue neque gravida in fermentum et sollicitudin. Porta lorem mollis aliquam ut porttitor leo.',
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        type: 'Grader',
        status: 'Hiring',
        minSalary: 14,
        departmentId: 'Computer Engineering',
    },
    {
        jobId: 3,
        targetYears: ['Junior', 'Senior'],
        hoursPerWeek: 15,
        title: 'Lab Research Assistant for Computer Architecture',
        description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        expirationDate: new Date().toISOString(),
        type: 'Assistant',
        status: 'Hiring',
        minSalary: 15,
        departmentId: 'Computer Science & Engineering',
    },
    {
        jobId: 4,
        targetYears: ['Freshman', 'Sophmore', 'Junior'],
        hoursPerWeek: 10,
        title: 'Learning Assistant for BIEN 102',
        description:
            'Arcu odio ut sem nulla pharetra diam. Sodales neque sodales ut etiam sit. Faucibus a pellentesque sit amet porttitor eget. Purus sit amet volutpat consequat mauris nunc congue nisi vitae. Mattis aliquam faucibus purus in massa tempor nec. Lectus proin nibh nisl condimentum id venenatis a condimentum vitae. Donec massa sapien faucibus et molestie ac feugiat sed. Cursus sit amet dictum sit amet justo donec enim diam. Cras semper auctor neque vitae tempus quam pellentesque. Odio tempor orci dapibus ultrices in iaculis nunc sed. Sit amet justo donec enim diam. In fermentum posuere urna nec tincidunt praesent semper feugiat nibh. Mauris augue neque gravida in fermentum et sollicitudin. Porta lorem mollis aliquam ut porttitor leo.',
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        type: 'Assistant',
        status: 'Hiring',
        minSalary: 14,
        departmentId: 'Bioengineering',
    },
    {
        jobId: 5,
        targetYears: ['Junior', 'Senior'],
        hoursPerWeek: 15,
        title: 'Lab Research Assistant in Embedded Systems',
        description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        type: 'Assistant',
        status: 'Hiring',
        minSalary: 15,
        departmentId: 'Electrical Engineering',
    },
    {
        jobId: 6,
        targetYears: ['Freshman', 'Sophmore', 'Junior'],
        hoursPerWeek: 10,
        title: 'Grader for CS010A',
        description:
            'Arcu odio ut sem nulla pharetra diam. Sodales neque sodales ut etiam sit. Faucibus a pellentesque sit amet porttitor eget. Purus sit amet volutpat consequat mauris nunc congue nisi vitae. Mattis aliquam faucibus purus in massa tempor nec. Lectus proin nibh nisl condimentum id venenatis a condimentum vitae. Donec massa sapien faucibus et molestie ac feugiat sed. Cursus sit amet dictum sit amet justo donec enim diam. Cras semper auctor neque vitae tempus quam pellentesque. Odio tempor orci dapibus ultrices in iaculis nunc sed. Sit amet justo donec enim diam. In fermentum posuere urna nec tincidunt praesent semper feugiat nibh. Mauris augue neque gravida in fermentum et sollicitudin. Porta lorem mollis aliquam ut porttitor leo.',
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        type: 'Grader',
        status: 'Hiring',
        minSalary: 14,
        departmentId: 'Computer Science & Engineering',
    },
    {
        jobId: 7,
        targetYears: ['Junior', 'Senior'],
        hoursPerWeek: 15,
        title: 'Lab Research Assistant in Machine Learning',
        description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        type: 'Assistant',
        status: 'Hiring',
        minSalary: 15,
        departmentId: 'Computer Science & Engineering',
    },
];

function JobRoot() {
    const [jobsFetched, setJobsFetched] = React.useState<IJob[]>([]);
    const [snack] = useSnack();
    const request = React.useCallback(() => getJobs(), []);

    const [sendRequest, isLoading] = useApi(request, {
        onSuccess: (response) => {
            const jobs = response.data.jobs;
            if (jobs.length === 0) {
                snack('No jobs were found', 'warning');
            } else {
                setJobsFetched(jobs);
            }
        },
    });

    const dummySendRequest = () => {
        setJobsFetched(dummyJobs);
    };

    return (
        <div style={{ padding: 20 }}>
            <Button
                variant='contained'
                color='primary'
                onClick={dummySendRequest}
            >
                Search
            </Button>
            {isLoading ? (
                <Loader size={55} />
            ) : (
                jobsFetched.length > 0 && (
                    <JobResults jobs={jobsFetched}></JobResults>
                )
            )}
        </div>
    );
}
export default JobRoot;
