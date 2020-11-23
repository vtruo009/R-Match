import React from 'react';
import Home from 'Pages/Home';
import SearchJobs from './Pages/SearchJobs';
import CreateJob from './Pages/CreateJob';
import SignIn from './Pages/SignIn';
import HomeIcon from '@material-ui/icons/Home';
import AddIcon from '@material-ui/icons/Add';
import PersonIcon from '@material-ui/icons/Person';
import SearchIcon from '@material-ui/icons/Search';

const Routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        icon: <HomeIcon />,
    },
    {
        path: '/search-jobs',
        name: 'Search Jobs',
        component: SearchJobs,
        icon: <SearchIcon />,
    },
    {
        path: '/create-job',
        name: 'Create Job',
        component: CreateJob,
        icon: <AddIcon />,
    },
    {
        path: '/sign-in',
        name: 'Sign In',
        component: SignIn,
        icon: <PersonIcon />,
    },
];

export default Routes;
