import React from 'react';

interface IAuthContext {
    authenticated: boolean,
    session?: string,
    setSession: Function,
    logout: Function
}

export const AuthContext = React.createContext<IAuthContext>({ authenticated: false, logout: () => {}, setSession: () => {} });