import React from 'react';
import Home from 'Pages/Home';
import SearchJobs from './Pages/SearchJobs';
import CreateJob from './Pages/CreateJob';
import CreateFacultyMemberProfile from './Pages/CreateFacultyMemberProfile';
import SignIn from './Pages/SignIn';
import SignUp from './Pages/SignUp';
import HomeIcon from '@material-ui/icons/Home';
import AddIcon from '@material-ui/icons/Add';
import PersonIcon from '@material-ui/icons/Person';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
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
        path:'/create-faculty-member-profile',
        name: 'Create Faculty Member Profile',
        component: CreateFacultyMemberProfile,
        icon: <AccountBoxIcon/>,
    },
    {
        path: '/sign-in',
        name: 'Sign In',
        component: SignIn,
        icon: <PersonIcon />,
    },
    {
        path: '/sign-up',
        name: 'Sign Up',
        component: SignUp,
        icon: <PersonAddIcon />,
    }
];

export default Routes;
