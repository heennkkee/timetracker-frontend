import { useContext } from "react";
import { Theme, ThemeContext } from "../context/ThemeContext";

const Loadingspinner = () => {
    const ThemeCtxt = useContext(ThemeContext);

    const themeInverse = ( ThemeCtxt.mode === Theme.Dark ) ? 'light' : 'dark';
    
    return (
        <div className="d-flex justify-content-center">
            <div className={`spinner-border text-${themeInverse}`} role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    )
}

export default Loadingspinner;