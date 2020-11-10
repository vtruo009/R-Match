import React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import Routes from '../../routes';
import AppBar from '@material-ui/core/AppBar';
import ToolBar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        navOptions: {
            marginRight: theme.spacing(2),
            textDecoration: 'none',
        },
    })
);

function NavBar() {
    const classes = useStyles();

    return (
        <AppBar position='static'>
            <ToolBar>
                {Routes.map((route, key) => (
                    <NavLink
                        key={key}
                        className={classes.navOptions}
                        to={route.path}
                    >
                        <Button
                            style={{ color: '#ffff' }}
                            startIcon={route.icon}
                        >
                            {route.name}
                        </Button>
                    </NavLink>
                ))}
            </ToolBar>
        </AppBar>
    );
}

export default withRouter(NavBar);
