import React from 'react';
import JobResults from '../Domains/Jobs/JobResults/JobResults';

const jobs = [
    {
        jobId: 1,
        targetYears: ['Junior', 'Senior'],
        hoursPerWeek: 15,
        title: 'Lab Research Assistant',
        description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        type: 'Assistant',
        status: 'Hiring',
        minSalary: 15,
        maxSalary: 20,
    },
    {
        jobId: 2,
        targetYears: ['Freshman', 'Sophmore', 'Junior'],
        hoursPerWeek: 10,
        title: 'ARC Tutor',
        description:
            'Arcu odio ut sem nulla pharetra diam. Sodales neque sodales ut etiam sit. Faucibus a pellentesque sit amet porttitor eget. Purus sit amet volutpat consequat mauris nunc congue nisi vitae. Mattis aliquam faucibus purus in massa tempor nec. Lectus proin nibh nisl condimentum id venenatis a condimentum vitae. Donec massa sapien faucibus et molestie ac feugiat sed. Cursus sit amet dictum sit amet justo donec enim diam. Cras semper auctor neque vitae tempus quam pellentesque. Odio tempor orci dapibus ultrices in iaculis nunc sed. Sit amet justo donec enim diam. In fermentum posuere urna nec tincidunt praesent semper feugiat nibh. Mauris augue neque gravida in fermentum et sollicitudin. Porta lorem mollis aliquam ut porttitor leo.',
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        type: 'Tutor',
        status: 'Hiring',
        minSalary: 14,
    },
    {
        jobId: 3,
        targetYears: ['Junior', 'Senior'],
        hoursPerWeek: 15,
        title: 'Lab Research Assistant',
        description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        type: 'Assistant',
        status: 'Hiring',
        minSalary: 15,
    },
    {
        jobId: 4,
        targetYears: ['Freshman', 'Sophmore', 'Junior'],
        hoursPerWeek: 10,
        title: 'ARC Tutor',
        description:
            'Arcu odio ut sem nulla pharetra diam. Sodales neque sodales ut etiam sit. Faucibus a pellentesque sit amet porttitor eget. Purus sit amet volutpat consequat mauris nunc congue nisi vitae. Mattis aliquam faucibus purus in massa tempor nec. Lectus proin nibh nisl condimentum id venenatis a condimentum vitae. Donec massa sapien faucibus et molestie ac feugiat sed. Cursus sit amet dictum sit amet justo donec enim diam. Cras semper auctor neque vitae tempus quam pellentesque. Odio tempor orci dapibus ultrices in iaculis nunc sed. Sit amet justo donec enim diam. In fermentum posuere urna nec tincidunt praesent semper feugiat nibh. Mauris augue neque gravida in fermentum et sollicitudin. Porta lorem mollis aliquam ut porttitor leo.',
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        type: 'Tutor',
        status: 'Hiring',
        minSalary: 14,
    },
    {
        jobId: 3,
        targetYears: ['Junior', 'Senior'],
        hoursPerWeek: 15,
        title: 'Lab Research Assistant',
        description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        type: 'Assistant',
        status: 'Hiring',
        minSalary: 15,
    },
    {
        jobId: 4,
        targetYears: ['Freshman', 'Sophmore', 'Junior'],
        hoursPerWeek: 10,
        title: 'ARC Tutor',
        description:
            'Arcu odio ut sem nulla pharetra diam. Sodales neque sodales ut etiam sit. Faucibus a pellentesque sit amet porttitor eget. Purus sit amet volutpat consequat mauris nunc congue nisi vitae. Mattis aliquam faucibus purus in massa tempor nec. Lectus proin nibh nisl condimentum id venenatis a condimentum vitae. Donec massa sapien faucibus et molestie ac feugiat sed. Cursus sit amet dictum sit amet justo donec enim diam. Cras semper auctor neque vitae tempus quam pellentesque. Odio tempor orci dapibus ultrices in iaculis nunc sed. Sit amet justo donec enim diam. In fermentum posuere urna nec tincidunt praesent semper feugiat nibh. Mauris augue neque gravida in fermentum et sollicitudin. Porta lorem mollis aliquam ut porttitor leo.',
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        type: 'Tutor',
        status: 'Hiring',
        minSalary: 14,
    },
    {
        jobId: 3,
        targetYears: ['Junior', 'Senior'],
        hoursPerWeek: 15,
        title: 'Lab Research Assistant',
        description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        type: 'Assistant',
        status: 'Hiring',
        minSalary: 15,
    },
    {
        jobId: 4,
        targetYears: ['Freshman', 'Sophmore', 'Junior'],
        hoursPerWeek: 10,
        title: 'ARC Tutor',
        description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        type: 'Tutor',
        status: 'Hiring',
        minSalary: 14,
    },
    {
        jobId: 3,
        targetYears: ['Junior', 'Senior'],
        hoursPerWeek: 15,
        title: 'Lab Research Assistant',
        description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        type: 'Assistant',
        status: 'Hiring',
        minSalary: 15,
    },
    {
        jobId: 4,
        targetYears: ['Freshman', 'Sophmore', 'Junior'],
        hoursPerWeek: 10,
        title: 'ARC Tutor',
        description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        type: 'Tutor',
        status: 'Hiring',
        minSalary: 14,
    },
];

function SearchJobs() {
    return <JobResults jobs={jobs}></JobResults>;
}

export default SearchJobs;
