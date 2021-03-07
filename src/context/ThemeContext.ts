import React from 'react';

export enum Theme {
    Light = "Light",
    Dark = "Dark"
}

interface IThemeContext {
    mode: Theme,
    toggle: Function
}

export const ThemeContext = React.createContext<IThemeContext>({ mode: Theme.Light, toggle: () => {} });