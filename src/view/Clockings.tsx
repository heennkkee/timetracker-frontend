import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Api from "../helper/Api";
//import Errormessage, { Error } from '../component/Errormessage';
import Button from '../component/Button';

import Loadingspinner from '../component/Loadingspinner';
import ManualClockingAddition from '../component/ManualClockingAddition';

import { Clocking } from '../helper/types';

const Clockings = () => {
    const [ lastDbClocking, setLastDbClocking ] = useState<null | Clocking>(null);
    const [ todaysClockings, setTodaysClockings ] = useState<null | Clocking[]>(null);

    const [ loadingLastClocking, setLoadingClocking ] = useState<boolean>(true);

    const [ sendingApiData, setSendingApiData ] = useState(false);

    const [ prev5Minute, setPrev5Minute ] = useState(() => {
        return new Date(new Date().setMinutes(new Date().getMinutes() - (new Date().getMinutes() % 5), 0, 0));
    });
    const [ next5Minute, setNext5Minute ] = useState(() => {
        return new Date(new Date().setMinutes(new Date().getMinutes() + 5 - (new Date().getMinutes() % 5), 0, 0));
    });

    // Interval was leaking, do something proper sometime..
    const update5Minutes = () => {
        console.log("updating clock times");
        const now = new Date();
        setPrev5Minute(new Date(new Date().setMinutes(now.getMinutes() - (now.getMinutes() % 5), 0, 0)));
        setNext5Minute(new Date(new Date().setMinutes(now.getMinutes() + 5 - (now.getMinutes() % 5), 0, 0)));
    }

    const AuthCtxt = useContext(AuthContext);

	useEffect(() => {
		const fetchLastClockingAsync = async () => {
            if (AuthCtxt.currentUser !== undefined) {
                const resp = await Api.loadClockings({ userid: AuthCtxt.currentUser }, { limit: 1 });
                if (resp.status === 200) {
                    if (resp.data.length > 0) {
                        setLastDbClocking(resp.data[0]);
                    }
                } else {
                    //setError({ message: resp.detail, title: resp.title });
                }

                setLoadingClocking(false);
            }
		}
        
        fetchLastClockingAsync();
	}, [ AuthCtxt.currentUser ]);

    const addClocking = async (dir: 'in' | 'out', datetime: Date = new Date()) => {
        if (AuthCtxt.currentUser !== undefined) {
            setSendingApiData(true);
            const resp = await Api.addClocking({ userid: AuthCtxt.currentUser }, { direction: dir, datetime: datetime.toJSON()});
            if (resp.status === 201) {
                if (lastDbClocking === null) {
                    setLastDbClocking(resp.data);
                } else {
                    if (new Date(resp.data.datetime) > new Date(lastDbClocking.datetime)) {
                        setLastDbClocking(resp.data);
                    }
                }
                const today = new Date();
                const newValDt = new Date(resp.data.datetime);

                if (newValDt.getFullYear() === today.getFullYear() && newValDt.getMonth() === today.getMonth() && newValDt.getDate() === today.getDate()) {
                    if (todaysClockings === null || todaysClockings.length === 0) {
                        setTodaysClockings([ resp.data ]);
                    } else {
                        let insertAtIx = todaysClockings.findIndex(clocking => {
                            return new Date(clocking.datetime) > new Date();
                        });

                        setTodaysClockings([
                            ...todaysClockings.slice(0, insertAtIx + 1),
                            resp.data,
                            ...todaysClockings.slice(insertAtIx + 1)
                        ]);
                    }
                }
            }
            update5Minutes();
            
            setSendingApiData(false);
        }
    }

    const btnStyle = (lastDbClocking?.direction ?? 'out') === 'in' ? 'danger' : 'success';
    const btnDir = (lastDbClocking?.direction ?? 'out') === 'in' ? 'out' : 'in';

    return (
        <div className="row">
            <div className="col-12">
                <h2>Clockings</h2>
                <div className="row">
                    {loadingLastClocking ? <Loadingspinner /> : 
                    <>
                        <div className="col-12">
                            {lastDbClocking === null ? <p>You have never clocked anything.</p> : 
                                <>
                                    <p key="status" className="lead">You are currently clocked <b>{lastDbClocking?.direction ?? '-'}</b>.</p>
                                    <p key="last-clock">You clocked {lastDbClocking?.direction ?? '-'} at <i>{lastDbClocking === null ? '' : new Date(lastDbClocking.datetime).toLocaleString()}</i>.</p>
                                </>
                            }
                        </div>
                        <div className="col-12 mb-3">
                            <h4>Clock {btnDir}</h4>
                            <Button disabled={sendingApiData} 
                                label={`@ ${prev5Minute.toLocaleTimeString().split(':').slice(0, 2).join(':')}`} id='toggle-clocking' 
                                btnStyle={btnStyle} 
                                onClick={() => { addClocking(btnDir, prev5Minute) }} 
                            />
                            <Button disabled={sendingApiData} 
                                label={`Now`} id='toggle-clocking' 
                                btnStyle={btnStyle} 
                                onClick={() => { addClocking(btnDir) }} 
                            />
                            <Button disabled={sendingApiData} 
                                label={`@ ${next5Minute.toLocaleTimeString().split(':').slice(0, 2).join(':')}`} id='toggle-clocking' 
                                btnStyle={btnStyle} 
                                onClick={() => { addClocking(btnDir, next5Minute) }} 
                            />
                        </div>
                    </>
                    }
                </div>
                <hr />
                <ManualClockingAddition addClocking={addClocking} disableButtons={sendingApiData} />
            </div>
        </div>
    );
}

export default Clockings;