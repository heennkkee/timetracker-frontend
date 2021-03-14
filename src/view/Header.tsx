import { useContext } from 'react';

import { Link, useLocation } from 'react-router-dom';

import { ThemeContext, Theme } from '../context/ThemeContext';

const Header = () => {
    const ThemeCtxt = useContext(ThemeContext);
    const theme = ( ThemeCtxt.mode === Theme.Dark ) ? 'dark' : 'light';
    const themeInverse = ( ThemeCtxt.mode === Theme.Dark ) ? 'light' : 'dark';

    let location = useLocation().pathname.split('/');
    location = location.filter((str, ix) => location.indexOf(str) === ix);

    const devCheck = process.env.NODE_ENV === 'development';

    return (
        <>
            {devCheck ? <div className="row p-2"><div className="alert alert-warning">Running in development mode!</div></div> : null}
            <div className="row">
                <nav className={`navbar navbar-${theme} bg-${theme}`}>
                    <Link to="/" className="navbar-brand">
                        <img className="d-inlineblock align-top" src="/logo192x192.png" height="30" width="30" alt="Flying money logo."></img> Let's track some time!
                    </Link>
                    <button className={`btn btn-${themeInverse}`} onClick={() => {
                        ThemeCtxt.toggle();
                    }}>
                        { ThemeCtxt.mode === Theme.Light ? 'Dark' : 'Light'}
                    </button>
                </nav>
                {
                    location.length >= 1 ? 
                        <div aria-label="breadcrumb">
                            <ol className="breadcrumb">
                                { location.map((link: string, ix: number) => {
                                    let text = link.length > 1 ? link.toLocaleUpperCase()[0] + link.substring(1, link.length - 1) : link;

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