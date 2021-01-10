import React, { useContext } from 'react';
import Container from '@material-ui/core/Container';
import { Switch, Route } from 'react-router-dom';

import {
    studentRoutes,
    facultyMemberRoutes,
    authenticatedRoutes,
    unauthenticatedRoutes,
    generalRoutes,
    IRoute,
} from 'routes';
import NavBar from 'Components/NavBar';
import { AuthContext } from 'Contexts/AuthContext';

const Routes = ({ routes }: { routes: IRoute[] }) => {
    return (
        <>
            {routes.map((route) => (
                <Route exact path={route.path} key={route.path}>
                    <route.component />
                </Route>
            ))}
        </>
    );
};

export default function App() {
    const { isAuthenticated, user } = useContext(AuthContext);

    const userRoutes = () => {
        switch (user?.role) {
            case 'student':
                return studentRoutes;
            case 'facultyMember':
                return facultyMemberRoutes;
            default:
                return [];
        }
    };

    return (
        <div className='App'>
            <NavBar />
            <Container style={{ marginTop: 50, marginBottom: 50 }}>
                <Switch>
                    {generalRoutes.map((route) => (
                        <Route exact path={route.path} key={route.path}>
                            <route.component />
                        </Route>
                    ))}
                    {/* Render routes based on user authentication*/}
                    {isAuthenticated ? (
                        <Routes
                            routes={[...authenticatedRoutes, ...userRoutes()]}
                        />
                    ) : (
                        <Routes routes={unauthenticatedRoutes} />
                    )}
                </Switch>
            </Container>
        </div>
    );
}
