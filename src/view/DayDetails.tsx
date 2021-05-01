import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Api from "../helper/Api";

import Loadingspinner from '../component/Loadingspinner';
import Timeline from "../component/Timeline";
import ClockingsTable from '../component/ClockingsTable';

import { Clocking } from '../helper/types';
import Input from "../component/Input";
import { useParams, useHistory } from "react-router-dom";
import Button from "../component/Button";


const DayDetails = () => {

    const { preSelectedDate } = useParams<{ preSelectedDate?: string }>();
    const useDate = preSelectedDate ?? new Date().toISOString().split('T')[0];

    const history = useHistory();

    const [ clockings, setClockings ] = useState<null | Clocking[]>(null);
    const [ loadingClockings, setLoadingClockings ] = useState<boolean>(true);

    const [ sendingApiData, setSendingApiData ] = useState(false);
    
    const AuthCtxt = useContext(AuthContext);

	useEffect(() => {
		const fetchTodaysClockingsAsync = async () => {
            if (AuthCtxt.currentUser !== undefined) {
                setLoadingClockings(true);
                const resp = await Api.loadClockings({ userid: AuthCtxt.currentUser }, { since: new Date(`${useDate} 00:00:00`).toJSON(), to: new Date(new Date(`${useDate} 00:00:00`).setDate(new Date(`${useDate} 00:00:00`).getDate() + 1)).toJSON() });
                if (resp.status === 200) {
                    setClockings(resp.data);
                } else {
                    //setError({ message: resp.detail, title: resp.title });
                }

                setLoadingClockings(false);
            }
		}
        
        fetchTodaysClockingsAsync();
	}, [ AuthCtxt.currentUser, useDate ]);

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
            
    return (
        <div className="row">
            <div className="col-12">
                <h2>Details for {new Date(useDate).toLocaleDateString()}</h2>
                <Input label="Day" type="date" id="selected-date-input" value={useDate} setValue={(val: string) => {
                    history.push(`/daydetails/${val}`);
                }} />
            </div>
            <div className="col-12 d-flex justify-content-between">
                <Button label="Previous" btnStyle="info" key="btn-previous" id="btn-previous" onClick={() => {
                    let newDate = new Date(new Date(useDate).setDate(new Date(useDate).getDate() - 1));
                    history.push(`/daydetails/${newDate.toLocaleString('sv-SE', {year: 'numeric', month: '2-digit', day: '2-digit'})}`);
                }}  />
                <Button label="Next" btnStyle="info" key="btn-next" id="btn-next" onClick={() => {
                    let newDate = new Date(new Date(useDate).setDate(new Date(useDate).getDate() + 1));
                    history.push(`/daydetails/${newDate.toLocaleString('sv-SE', {year: 'numeric', month: '2-digit', day: '2-digit'})}`);
                }} spaceToLeft={true} />
            </div>
            <div className="col-12 mt-4">
                <h4>Timeline</h4>
                { loadingClockings ? <Loadingspinner /> : (clockings !== null ? <Timeline baseDate={new Date(useDate)} clockings={clockings} /> : null )}
            </div>
            <div className="col-12 mt-4">
                <h4>Table</h4>
                { loadingClockings ? <Loadingspinner /> : (clockings !== null ? <ClockingsTable disableAction={sendingApiData} clockings={clockings} removeClocking={removeClocking} /> : null )}
            </div>
        </div>
    );
}

export default DayDetails;