import { useContext } from "react";
import { Theme, ThemeContext } from "../context/ThemeContext";

type SupportedInputTypes = 'email' | 'password' | 'string' | 'number' | 'date' | 'time' | 'month';

type InputProps = {
    label: string,
    type: SupportedInputTypes,
    id: string,
    required?: boolean,
    setValue: Function,
    value: string | number | null,
    max?: string,
    autoComplete?: string
}

const Input = (props: InputProps) => {
    const ThemeCtxt = useContext(ThemeContext);
    
    const inputClass = ( ThemeCtxt.mode === Theme.Dark ) ? 'input-dark text-white-50' : '';
    const labelClass = ( ThemeCtxt.mode === Theme.Dark ) ? 'text-white-50' : '';

    return (
        <div className="mb-3">
            <label htmlFor={props.label.replace(" ", "")} className={`form-label ${labelClass}`}>{props.label}</label>
            <input 
                max={props.max} 
                type={props.type} 
                required={props.required} 
                className={`form-control ${inputClass}`}
                id={props.label.replace(" ", "")} 
                value={props.value ?? ''} 
                inputMode={props.type === 'number' ? 'numeric' : 'none'}
                autoComplete={props.autoComplete}
                onChange={(ev) => { 
                    props.setValue(ev.target.value);
                }
            } />
        </div>
    )
}

export default Input;