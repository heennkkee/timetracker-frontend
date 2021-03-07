import { useContext } from 'react';

import { ThemeContext, Theme } from '../context/ThemeContext';

const Header = () => {
    const ThemeCtxt = useContext(ThemeContext);
    const theme = ( ThemeCtxt.mode === Theme.Dark ) ? 'dark' : 'light';
    const themeInverse = ( ThemeCtxt.mode === Theme.Dark ) ? 'light' : 'dark';

    return (
        <div className="row">
            <nav className={`navbar navbar-${theme} bg-${theme}`}>
                <div className="navbar-brand">
                    <img className="d-inlineblock align-top" src="logo192x192.png" height="30" width="30" alt="Flying money logo."></img> Let's track some time!
                </div>
                <button className={`btn btn-${themeInverse}`} onClick={() => {
                    ThemeCtxt.toggle();
                }}>
                    { ThemeCtxt.mode === Theme.Light ? 'Dark' : 'Light'}
                </button>
            </nav>
        </div>
    )

}

export default Header;