import React, { createContext, useState, useEffect } from 'react';
import { isAuthenticatedRequest, JWTUser } from './api';
import useApi from 'hooks/useApi';
import Loader from 'Components/Loader';

interface IAuthContext {
    user: JWTUser | undefined;
    setUser: (user: JWTUser) => void;
    isAuthenticated: boolean;
    setIsAuthenticated: (newIsAuthenticated: boolean) => void;
}

const AuthContextDefaultValue = {
    user: undefined,
    setUser: (user: JWTUser) => {},
    isAuthenticated: false,
    setIsAuthenticated: (newIsAuthenticated: boolean) => {},
};

export const AuthContext = createContext<IAuthContext>(AuthContextDefaultValue);

function AuthContextComponent({ children }: { children: JSX.Element }) {
    const [user, setUser] = useState<JWTUser>();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const request = React.useCallback(() => isAuthenticatedRequest(), []);
    const [sendRequest, isLoading] = useApi(request, {
        onSuccess: (results) => {
            setUser(results.data.user);
            setIsAuthenticated(results.data.isAuthenticated);
        },
        onFailure: () => {
            setUser(undefined);
            setIsAuthenticated(false);
        },
    });

    useEffect(() => {
        sendRequest();
    }, [sendRequest]);

    return (
        <div>
            {isLoading ? (
                <Loader center size={80} />
            ) : (
                <AuthContext.Provider
                    value={{
                        user,
                        setUser,
                        isAuthenticated,
                        setIsAuthenticated,
                    }}
                >
                    {children}
                </AuthContext.Provider>
            )}
        </div>
    );
}

export default AuthContextComponent;
