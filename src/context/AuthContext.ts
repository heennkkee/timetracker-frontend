import React from 'react';

interface IAuthContext {
    authenticated: boolean,
    session?: string,
    logout: Function,
    login: Function
}

export const AuthContext = React.createContext<IAuthContext>({ authenticated: false, login: () => {}, logout: () => {} });