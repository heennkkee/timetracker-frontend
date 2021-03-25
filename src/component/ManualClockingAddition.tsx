import { useState } from "react";

import Input from './Input';
import Button from './Button';

type InputProps = {
    addClocking: Function,
    disableButtons: boolean
}

const ManualClockingAddition = (props: InputProps) => {

    const [date, setDate] = useState("");
    const [time, setTime] = useState("");

    return (
        <div className="col-12 mb-3">
            <h4>Manual clockings</h4>
            <Input id="date-input" label="Date" setValue={setDate} type="date" value={date} max={new Date().toLocaleDateString()} />
            <Input id="date-input" label="Time" setValue={setTime} type="time" value={time} />
            <Button disabled={props.disableButtons || date === '' || time === ''} 
                    label='In' id='clock-in' 
                    btnStyle='success' 
                    onClick={() => { props.addClocking('in', new Date(date + ' ' + time)); }} 
                />
            <Button disabled={props.disableButtons || date === '' || time === ''} 
                    label='Out' id='clock-out' 
                    btnStyle='danger' 
                    onClick={() => { props.addClocking('out', new Date(date + ' ' + time)); }} 
                />
        </div>
    )
}

export default ManualClockingAddition;

