import { useContext } from "react";
import { Theme, ThemeContext } from "../context/ThemeContext";

type InputProps = {
    label: string,
    type: 'email' | 'password' | 'string' | 'number' | 'date' | 'time',
    id: string,
    required?: boolean,
    setValue: Function,
    value: string | number | null,
    max?: string
}

const Input = (props: InputProps) => {
    const ThemeCtxt = useContext(ThemeContext);
    
    const inputClass = ( ThemeCtxt.mode === Theme.Dark ) ? 'input-dark text-white-50' : '';
    const labelClass = ( ThemeCtxt.mode === Theme.Dark ) ? 'text-white-50' : '';

    return (
        <div className="mb-3">
            <label htmlFor={props.label.replace(" ", "")} className={`form-label ${labelClass}`}>{props.label}</label>
            <input max={props.max} type={props.type} required={props.required} className={`form-control ${inputClass}`} id={props.label.replace(" ", "")} value={props.value ?? ''} onChange={(ev) => { 
                    props.setValue(ev.target.value);
                }
            }></input>
        </div>
    )
}

export default Input;