import React from 'react';
import Home from 'Pages/Home';
import SearchJobs from './Pages/SearchJobs';
import CreateJob from './Pages/CreateJob';
import CreateProfessorProfile from './Pages/CreateProfessorProfile'
import HomeIcon from '@material-ui/icons/Home';
import AddIcon from '@material-ui/icons/Add';
import SearchIcon from '@material-ui/icons/Search';
import AccountBoxIcon from '@material-ui/icons/AccountBox'; 

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
        path:'/create-professor-profile',
        name: 'Create Faculty Member Profile',
        component: CreateProfessorProfile,
        icon: <AccountBoxIcon/>,
    }
];

export default Routes;
