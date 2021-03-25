import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Api from "../helper/Api";
//import Errormessage, { Error } from '../component/Errormessage';
import Button from '../component/Button';

import Loadingspinner from '../component/Loadingspinner';
import ManualClockingAddition from '../component/ManualClockingAddition';


type Direction = 'in' | 'out';

const Clockings = () => {
    const [clockings, setClockings] = useState<null | { id: number, direction: Direction, userid: number, datetime: string }[]>(null);
    //const [error, setError] = useState< Error | null >(null);
    const [loadingData, setLoadingData] = useState<boolean>(true);

    const [ sendingApiData, setSendingApiData ] = useState(false);

    const [ lastClocking, setLastClocking ] = useState<null | { direction: Direction, datetime: Date }>(null);
    
    const [ oldPostsLimit /*, setOldPostsLimit */ ] = useState(15);

    const [ prev5Minute, setPrev5Minute ] = useState(() => {
        return new Date(new Date().setMinutes(new Date().getMinutes() - (new Date().getMinutes() % 5), 0, 0));
    });
    const [ next5Minute, setNext5Minute ] = useState(() => {
        return new Date(new Date().setMinutes(new Date().getMinutes() + 5 - (new Date().getMinutes() % 5), 0, 0));
    });


    // Write proper timeout for this?
    useEffect(() => {
        setInterval(() => {
            console.log("updating clock times");
            const now = new Date();
            setPrev5Minute(new Date(new Date().setMinutes(now.getMinutes() - (now.getMinutes() % 5), 0, 0)));
            setNext5Minute(new Date(new Date().setMinutes(now.getMinutes() + 5 - (now.getMinutes() % 5), 0, 0)));
        }, 30000);
    }, []);

    const AuthCtxt = useContext(AuthContext);

    useEffect(() => {
        if (clockings !== null && clockings.length > 0) {
            setLastClocking({ direction: clockings[0].direction, datetime: new Date(clockings[0].datetime) });
        }
    }, [ clockings ]);

	useEffect(() => {
		const fetchAsync = async () => {
            if (AuthCtxt.currentUser !== undefined) {
                const resp = await Api.loadClockings({ userid: AuthCtxt.currentUser }, { limit: oldPostsLimit });
                console.log(resp);
                if (resp.status === 200) {
                    setClockings(resp.data);
                } else {
                    //setError({ message: resp.detail, title: resp.title });
                }

                setLoadingData(false);
            }
		}
        fetchAsync();
	}, [ oldPostsLimit, AuthCtxt.currentUser ]);

    const addClocking = async (dir: 'in' | 'out', datetime: Date = new Date()) => {
        if (AuthCtxt.currentUser !== undefined) {
            setSendingApiData(true);
            const resp = await Api.addClocking({ userid: AuthCtxt.currentUser }, { direction: dir, datetime: datetime.toJSON()});
            if (resp.status === 201) {
                if (clockings !== null) {
                    setClockings([ resp.data, ...clockings.splice(0, oldPostsLimit - 1) ]);
                } else {
                    setClockings([resp.data]);
                }
            }

            setSendingApiData(false);
        }
    }

    const removeClocking = async (id: number) => {
        if (AuthCtxt.currentUser !== undefined) {
            setSendingApiData(true);
            const resp = await Api.removeClocking({ userid: AuthCtxt.currentUser, clockingid: id });
            if (resp.status === 200) {
                if (clockings !== null) {
                    setClockings([ ...clockings.filter(clocking => clocking.id !== id) ]);
                } else {
                    setClockings([]);
                }
            }

            setSendingApiData(false);
        }
    }
    
    const btnStyle = (lastClocking?.direction ?? 'out') === 'in' ? 'danger' : 'success';
    const btnDir = (lastClocking?.direction ?? 'out') === 'in' ? 'out' : 'in';

    return (
        <div className="row">
            <div className="col-12">
                <h2>Clockings</h2>
                {
                    (loadingData ? 
                        <Loadingspinner />
                    :
                        <div className="row">
                            <div className="col-12">
                                {lastClocking !== null ? 
                                        <>
                                            <p key="status" className="lead">You are currently clocked <b>{lastClocking.direction ?? 'out'}</b>.</p>
                                            <p key="last-clock">You clocked {lastClocking.direction ?? 'out'} at {lastClocking.datetime.toLocaleString()}.</p>
                                        </>
                                    :
                                        null
                                }
                            </div>
                            <div className="col-12 mb-3">

                                <Button disabled={sendingApiData} 
                                    label={`Clock ${btnDir} @ ${prev5Minute.toLocaleTimeString().split(':').slice(0, 2).join(':')}`} id='toggle-clocking' 
                                    btnStyle={btnStyle} 
                                    onClick={() => { addClocking(btnDir, prev5Minute) }} 
                                />
                                <Button disabled={sendingApiData} 
                                    label={`Clock ${btnDir} now`} id='toggle-clocking' 
                                    btnStyle={btnStyle} 
                                    onClick={() => { addClocking(btnDir) }} 
                                />
                                <Button disabled={sendingApiData} 
                                    label={`Clock ${btnDir} @ ${next5Minute.toLocaleTimeString().split(':').slice(0, 2).join(':')}`} id='toggle-clocking' 
                                    btnStyle={btnStyle} 
                                    onClick={() => { addClocking(btnDir, next5Minute) }} 
                                />
                            </div>

                            <ManualClockingAddition addClocking={addClocking} disableButtons={sendingApiData} />

                            {clockings?.map((val) => { 
                                return (
                                    <p key={val["id"]}>
                                        {new Date(val["datetime"]).toLocaleString()} - {val["direction"]} 
                                        <Button id={`remove-clocking-${val['id']}`} disabled={sendingApiData} label='X' btnStyle='danger' onClick={() => { removeClocking(val["id"])}} />
                                    </p> 
                                );
                            })}
                        </div>
                    )
                }
            </div>
        </div>
    );
}

export default Clockings;