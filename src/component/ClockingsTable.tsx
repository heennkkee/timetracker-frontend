import { useContext, useEffect, useState } from "react";
import { Theme, ThemeContext } from "../context/ThemeContext";
import Button from './Button';
import { Clocking } from '../helper/types';

type InputProps = {
    clockings: Clocking[],
    removeClocking?: Function,
    disableAction?: boolean
}

const Timeline = (props: InputProps) => {
    const ThemeCtxt = useContext(ThemeContext);

    const [ clockings, setClockings ] = useState<Clocking[]>([]);

    useEffect(() => {
        let temp: Clocking[] = JSON.parse(JSON.stringify(props.clockings));
        setClockings(temp.reverse())
    }, [props.clockings]);


    const tableClass = ( ThemeCtxt.mode === Theme.Dark ) ? 'table-dark text-white-50' : '';

    let callback = props.removeClocking;
    return (
        <table className={`table ${tableClass}`}>
            <thead>
                <tr>
                    <th scope="col">Time</th>
                    <th scope="col">Direction</th>
                    <th scope="col">Action</th>
                </tr>
            </thead>
            <tbody>
                {clockings.map((val) => { 
                        return (
                            <tr key={val['id']}>
                                <td>{new Date(val["datetime"]).toLocaleString()}</td>
                                <td>{val["direction"]}</td>
                                <td>
                                    {callback !== undefined ? <Button id={`remove-clocking-${val['id']}`} disabled={props?.disableAction ?? false} label='X' btnStyle='danger' onClick={() => { if (callback !== undefined) { callback(val["id"]); } }} /> : null}
                                </td>
                            </tr>
                        );
                    })
                }
            </tbody>
        </table>
    )
}

export default Timeline;