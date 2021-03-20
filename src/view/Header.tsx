import React, { useContext } from 'react';

import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

import { ThemeContext, Theme } from '../context/ThemeContext';

import Button from '../component/Button';


const Header = () => {
    const ThemeCtxt = useContext(ThemeContext);
    const theme = ( ThemeCtxt.mode === Theme.Dark ) ? 'dark' : 'light';

    const AuthCtxt = useContext(AuthContext);

    let location = useLocation().pathname.split('/');
    location = location.filter((str, ix) => location.indexOf(str) === ix);
    const devCheck = process.env.NODE_ENV === 'development';

    return (
        <>
            {devCheck ? <div className="row p-2"><div className="alert alert-warning">Running in development mode!</div></div> : null}
            <div className="row">
                <nav className={`navbar navbar-${theme} bg-${theme} navbar-expand-lg`}>
                    <Link to="/" className="navbar-brand">
                        <img className="d-inlineblock align-top" src="/logo192x192.png" height="30" width="30" alt="Flying money logo."></img> <span className="lead">Let's track some time!</span>
                    </Link>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarCollapse">
                        <ul className="navbar-nav me-auto">
                            <li className="nav-item">
                                <Link to="/users" className={`nav-link ${location[1] === 'users' ? 'active' : ''}`}>Users</Link>
                            </li>
                        </ul>
                        <div className="form-inline">
                            {
                                AuthCtxt.authenticated ? 
                                    <Button id='logout-button' label='Logout' onClick={async () => { await AuthCtxt.logout(); }} />
                                :
                                    null
                            }
                            <Button id='toggleTheme-button' label={ ThemeCtxt.mode === Theme.Light ? 'Dark' : 'Light'} onClick={() => { ThemeCtxt.toggle(); }} />
                        </div>
                    </div>
                </nav>
                {
                    location.length >= 1 && AuthCtxt.authenticated ? 
                        <div aria-label="breadcrumb">
                            <ol className="breadcrumb">
                                { location.map((link: string, ix: number) => {
                                    let text = link.length > 1 ? link.toLocaleUpperCase()[0] + link.substring(1, link.length) : link;

                                    if (ix === location.length - 1) {
                                        return <li key={link} className="breadcrumb-item active">{text}</li>
                                    }

                                    return <li  key={link} className="breadcrumb-item"><Link to={`/${link}`} className="breadcrumb-item">{(link === '' ? 'Home' : text)}</Link></li>
                                })}
                            </ol>
                        </div>
                    :
                        null
                }
            </div>
        </>
    )

}

export default Header;