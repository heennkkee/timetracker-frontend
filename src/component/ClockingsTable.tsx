import { useContext, useEffect, useState } from "react";
import { Theme, ThemeContext } from "../context/ThemeContext";
import Button from './Button';
import { Clocking } from '../helper/types';

import Api from '../helper/Api';
import { AuthContext } from '../context/AuthContext';

type InputProps = {
    clockings: Clocking[]
}

const Timeline = (props: InputProps) => {
    const ThemeCtxt = useContext(ThemeContext);
    const AuthCtxt = useContext(AuthContext);

    const [ sendingApiData, setSendingApiData ] = useState(false);

    const [ clockings, setClockings ] = useState<Clocking[]>([]);

    useEffect(() => {
        let temp: Clocking[] = JSON.parse(JSON.stringify(props.clockings));
        setClockings(temp.reverse())
    }, [props.clockings]);


    const removeClocking = async (id: number) => {
        if (AuthCtxt.currentUser !== undefined) {
            setSendingApiData(true);
            const resp = await Api.removeClocking({ userid: AuthCtxt.currentUser, clockingid: id });

            // This can be cleaned up....
            if (resp.status === 200) {
                if (clockings !== null) {
                    let newClockings = [ ...clockings ];
                    newClockings = newClockings.filter(clocking => clocking.id !== id);
                    setClockings(newClockings);
                }
            }
            
            setSendingApiData(false);
        }
    }

    const tableClass = ( ThemeCtxt.mode === Theme.Dark ) ? 'table-dark text-white-50' : '';

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
                                    <Button id={`remove-clocking-${val['id']}`} disabled={sendingApiData} label='X' btnStyle='danger' onClick={() => { removeClocking(val["id"])}} />
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