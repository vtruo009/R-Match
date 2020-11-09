import React, { useState } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import Routes from '../routes';
import AppBar from '@material-ui/core/AppBar';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        navOptions: {
            marginRight: theme.spacing(2),
        },
    })
);

function NavBar() {
    const classes = useStyles();
    const [pageSelected, setPageSelected] = useState('Home');
    return (
        <AppBar position='static'>
            <Tabs>
                {Routes.map((prop, key) => {
                    return (
                        <NavLink
                            onClick={() => setPageSelected(prop.name)}
                            className={classes.navOptions}
                            to={prop.path}
                            style={{ textDecoration: 'none', color: '#ffff' }}
                            key={key}
                        >
                            <Tab
                                label={prop.name}
                                icon={prop.icon}
                                selected={pageSelected === prop.name}
                            />
                        </NavLink>
                    );
                })}
            </Tabs>
        </AppBar>
    );
}

export default withRouter(NavBar);
