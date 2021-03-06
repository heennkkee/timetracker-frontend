import { useContext } from "react";
import { Theme, ThemeContext } from "../context/ThemeContext";

type ButtonProps = {
    type?: 'submit',
    btnStyle?: 'success' | 'info' | 'danger',
    id: string,
    label: string,
    onClick: React.MouseEventHandler<HTMLButtonElement>,
    disabled?: boolean,
    spaceToLeft?: boolean
}

const Button = (props: ButtonProps) => {

    const ThemeCtxt = useContext(ThemeContext);
    const buttonClass = ( ThemeCtxt.mode === Theme.Dark ) ? `button-dark${props.btnStyle !== undefined ? `-${props.btnStyle}` : ''} text-white-50` : `btn-${props.btnStyle ?? 'dark'}`;

    return (
        <button disabled={props.disabled} 
            type={props.type ?? 'button'} 
            className={`btn ${buttonClass} ${props.disabled ? 'disabled' : ''} ${(props.spaceToLeft ?? false) ? 'ms-2' : 'me-2'}`} 
            id={props.id} 
            onClick={(ev) => {
                if (!props.disabled)
                    props.onClick(ev);
            }}
        >
            {props.label}
        </button>
    )
}

export default Button;