import React, { useContext } from 'react';
import Container from '@material-ui/core/Container';
import { Switch, Route } from 'react-router-dom';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { Worker } from '@react-pdf-viewer/core';

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

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#043ca4',
        },
        secondary: {
            main: '#fbbb14',
        },
        warning: {
            main: '#d32f2f',
        },
    },
});

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
        <Worker workerUrl='https://unpkg.com/pdfjs-dist@2.6.347/build/pdf.worker.min.js'>
            <div className='App'>
                <MuiThemeProvider theme={theme}>
                    <NavBar />
                    <Container style={{ marginTop: 60, marginBottom: 60 }}>
                        <Switch>
                            {generalRoutes.map((route) => (
                                <Route exact path={route.path} key={route.path}>
                                    <route.component />
                                </Route>
                            ))}
                            {/* Render routes based on user authentication*/}
                            {isAuthenticated ? (
                                <Routes
                                    routes={[
                                        ...authenticatedRoutes,
                                        ...userRoutes(),
                                    ]}
                                />
                            ) : (
                                <Routes routes={unauthenticatedRoutes} />
                            )}
                        </Switch>
                    </Container>
                </MuiThemeProvider>
            </div>
        </Worker>
    );
}
