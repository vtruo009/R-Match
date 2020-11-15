import React from 'react';
import Container from '@material-ui/core/Container';
import { Switch, Route } from 'react-router-dom';
import Routes from './routes';
import NavBar from './Components/NavBar/NavBar';

export default function App() {
    return (
        <div className='App'>
            <NavBar />
            <Container maxWidth='sm'>
                <Switch>
                    {Routes.map((route) => (
                        <Route exact path={route.path} key={route.path}>
                            <route.component />
                        </Route>
                    ))}
                </Switch>
            </Container>
        </div>
    );
}
