import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';

import App from 'App';
import 'index.css';
import AuthProvider from 'Contexts/AuthContext';

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <SnackbarProvider maxSnack={3}>
                <AuthProvider>
                    <App />
                </AuthProvider>
            </SnackbarProvider>
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root')
);
