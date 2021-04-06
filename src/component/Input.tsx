import { useContext } from "react";
import { Theme, ThemeContext } from "../context/ThemeContext";

type SupportedInputTypes = 'email' | 'password' | 'string' | 'number' | 'date' | 'time' | 'month' | 'checkbox';

type InputProps = {
    label: string,
    type: SupportedInputTypes,
    id: string,
    required?: boolean,
    setValue: Function,
    value: string | number | null,
    max?: string,
    checked?: boolean,
    autoComplete?: string
}

const Input = (props: InputProps) => {
    const ThemeCtxt = useContext(ThemeContext);
    
    const inputClass = ( ThemeCtxt.mode === Theme.Dark ) ? 'input-dark text-white-50' : '';
    const labelClass = ( ThemeCtxt.mode === Theme.Dark ) ? 'text-white-50' : '';

    const wrapperClass = (props.type === 'checkbox') ? 'form-check mb-3' : 'mb-3';
    const checkAdd = (props.type === 'checkbox') ? 'check-' : '';
    const inputFormClass = (props.type === 'checkbox') ? 'form-check-input' : 'form-control';
    return (
        <div className={wrapperClass}>
            <label htmlFor={props.label.replace(" ", "")} className={`form-${checkAdd}label ${labelClass}`}>{props.label}</label>
            <input 
                max={props.max} 
                type={props.type} 
                required={props.required} 
                className={`${inputFormClass} ${inputClass}`}
                id={props.label.replace(" ", "")} 
                value={props.value ?? ''} 
                checked={props.checked ?? false}
                inputMode={props.type === 'number' ? 'numeric' : 'none'}
                autoComplete={props.autoComplete}
                onChange={(ev) => {
                    let val;
                    if (props.type === 'checkbox') {
                        val = ev.target.checked;
                    } else {
                        val = ev.target.value;
                    }
                    props.setValue(val);
                }
            } />
        </div>
    )
}

export default Input;