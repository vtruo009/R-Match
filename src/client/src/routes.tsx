import React from 'react';
import HomeIcon from '@material-ui/icons/Home';
import SearchIcon from '@material-ui/icons/Search';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import PersonIcon from '@material-ui/icons/Person';
import DashboardIcon from '@material-ui/icons/Dashboard';
import MailIcon from '@material-ui/icons/Mail';

import Home from 'Pages/Home';
import SearchJobs from 'Pages/SearchJobs';
import SearchStudents from 'Pages/SearchStudents';
import JobFacultyMemberDashboard from 'Pages/JobFacultyMemberDashboard';
import JobStudentDashboard from 'Pages/JobStudentDashboard';
import JobApplicants from 'Pages/JobApplicants';
import Profile from 'Pages/Profile';
import SignIn from 'Pages/SignIn';
import SignUp from 'Pages/SignUp';
import Message from 'Pages/Message';

export interface IRoute {
    path: string;
    name: string;
    component: () => JSX.Element;
    icon: JSX.Element;
    hide?: boolean;
}

// Add other routes for non-authenticated users
export const generalRoutes: IRoute[] = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        icon: <HomeIcon />,
    },
];

// Add other routes for non-authenticated users
export const unauthenticatedRoutes: IRoute[] = [
    {
        path: '/sign-in',
        name: 'Sign in',
        component: SignIn,
        icon: <PersonIcon />,
    },
    {
        path: '/sign-up',
        name: 'Sign up',
        component: SignUp,
        icon: <PersonAddIcon />,
    },
];

// Add other routes that are shared among all users
export const authenticatedRoutes: IRoute[] = [
    {
        path: '/profile',
        name: 'Profile',
        component: Profile,
        icon: <PersonIcon />,
    },
    {
        path: '/message',
        name: 'Message',
        component: Message,
        icon: <MailIcon />,
    },
];

// Add routes specific to students
export const studentRoutes: IRoute[] = [
    {
        path: '/search-jobs',
        name: 'Search Jobs',
        component: SearchJobs,
        icon: <SearchIcon />,
    },
    {
        path: '/job-dashboard',
        name: 'Dashboard',
        component: JobStudentDashboard,
        icon: <DashboardIcon />,
    },
];

// Add routes specific to faculty members
export const facultyMemberRoutes: IRoute[] = [
    {
        path: '/search-students',
        name: 'Search students',
        component: SearchStudents,
        icon: <SearchIcon />,
    },
    {
        path: '/job-dashboard',
        name: 'Dashboard',
        component: JobFacultyMemberDashboard,
        icon: <DashboardIcon />,
    },
    {
        path: '/job-applicants/:jobId',
        name: 'Job Applicants',
        component: JobApplicants,
        hide: true,
        icon: <DashboardIcon />,
    },
];
