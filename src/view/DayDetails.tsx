import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Api from "../helper/Api";
import Button from '../component/Button';

import Loadingspinner from '../component/Loadingspinner';
import Timeline from "../component/Timeline";

import { Clocking } from '../helper/types';
import Input from "../component/Input";
import { Theme, ThemeContext } from "../context/ThemeContext";


const DayDetails = () => {
    const [ clockings, setClockings ] = useState<null | Clocking[]>(null);
    const [ loadingClockings, setLoadingClockings ] = useState<boolean>(true);

    const [ selectedDate, setSelectedDate ] = useState<string>(new Date().toLocaleDateString());
    console.log(selectedDate);

    const [ sendingApiData, setSendingApiData ] = useState(false);

    const AuthCtxt = useContext(AuthContext);

	useEffect(() => {
		const fetchTodaysClockingsAsync = async () => {
            if (AuthCtxt.currentUser !== undefined) {
                setLoadingClockings(true);
                const resp = await Api.loadClockings({ userid: AuthCtxt.currentUser }, { since: new Date(selectedDate).toJSON(), to: new Date(new Date(selectedDate).setDate(new Date(selectedDate).getDate() + 1)).toJSON() });
                if (resp.status === 200) {
                    setClockings(resp.data);
                } else {
                    //setError({ message: resp.detail, title: resp.title });
                }

                setLoadingClockings(false);
            }
		}
        
        fetchTodaysClockingsAsync();
	}, [ AuthCtxt.currentUser, selectedDate ]);

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
    
    const ThemeCtxt = useContext(ThemeContext);
    
    const tableClass = ( ThemeCtxt.mode === Theme.Dark ) ? 'table-dark text-white-50' : '';
    
    return (
        <div className="row">
            <div className="col-12">
                <h2>Details for {selectedDate}</h2>
                <Input label="Day" type="date" id="selected-date-input" value={selectedDate} setValue={setSelectedDate} />
            </div>
            <div className="col-12 mt-4">
                <h4>Timeline</h4>
                { loadingClockings ? <Loadingspinner /> : (clockings !== null ? <Timeline baseDate={new Date(selectedDate)} clockings={clockings} /> : null )}
            </div>
            <div className="col-12 mt-4">
                <h4>Table</h4>
                { loadingClockings ? <Loadingspinner /> :
                    ((clockings?.length ?? 0) === 0) ? <p>No clockings for {selectedDate}.</p> : 
                        <table className={`table ${tableClass}`}>
                            <thead>
                                <tr>
                                    <th scope="col">Time</th>
                                    <th scope="col">Direction</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {clockings?.map((val) => { 
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
                }
            </div>
        </div>
    );
}

export default DayDetails;