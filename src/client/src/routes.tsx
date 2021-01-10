import React from 'react';
import Home from 'Pages/Home';
import SearchJobs from './Pages/SearchJobs';
import CreateJob from './Pages/CreateJob';
import Profile from './Pages/Profile';
import SignIn from './Pages/SignIn';
import SignUp from './Pages/SignUp';
import Message from './Pages/Message';

import HomeIcon from '@material-ui/icons/Home';
import AddIcon from '@material-ui/icons/Add';
import SearchIcon from '@material-ui/icons/Search';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import PersonIcon from '@material-ui/icons/Person';
import MailIcon from '@material-ui/icons/Mail';

export interface IRoute {
    path: string;
    name: string;
    component: () => JSX.Element;
    icon: JSX.Element;
}

// Add other routes for non-authenticated users
export const generalRoutes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        icon: <HomeIcon />,
    },
];

// Add other routes for non-authenticated users
export const unauthenticatedRoutes = [
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
export const authenticatedRoutes = [
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
export const studentRoutes = [
    {
        path: '/search-jobs',
        name: 'Search Jobs',
        component: SearchJobs,
        icon: <SearchIcon />,
    },
];

// Add routes specific to faculty members
export const facultyMemberRoutes = [
    {
        path: '/create-job',
        name: 'Create Job',
        component: CreateJob,
        icon: <AddIcon />,
    },
];
