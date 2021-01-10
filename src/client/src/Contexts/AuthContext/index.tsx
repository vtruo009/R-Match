import React, { createContext, useState, useEffect } from 'react';

import { isAuthenticatedRequest, IAuthUser } from './api';
import useApi from 'hooks/useApi';
import Loader from 'Components/Loader';

interface IAuthContext {
    user: IAuthUser | undefined;
    setUser: (user: IAuthUser) => void;
    isAuthenticated: boolean;
    setIsAuthenticated: (newIsAuthenticated: boolean) => void;
}

const AuthContextDefaultValue = {
    user: undefined,
    setUser: (user: IAuthUser) => {},
    isAuthenticated: false,
    setIsAuthenticated: (newIsAuthenticated: boolean) => {},
};

export const AuthContext = createContext<IAuthContext>(AuthContextDefaultValue);

interface AuthContextProps {
    children: JSX.Element;
}

function AuthContextComponent({ children }: AuthContextProps) {
    const [user, setUser] = useState<IAuthUser>();
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
