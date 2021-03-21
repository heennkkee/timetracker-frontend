import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Api from "../helper/Api";
import Errormessage, { Error } from '../component/Errormessage';
import Button from '../component/Button';

import Loadingspinner from '../component/Loadingspinner';

type Direction = 'in' | 'out';

const Clockings = () => {
    const [clockings, setClockings] = useState<null | { id: number, direction: Direction, user_id: number, datetime: string }[]>(null);
    const [error, setError] = useState< Error | null >(null);
    const [loadingData, setLoadingData] = useState<boolean>(true);

    const [ sendingApiData, setSendingApiData ] = useState(false);

    const [ lastClocking, setLastClocking ] = useState<null | { direction: Direction, datetime: Date }>(null);
    
    const [ oldPostsLimit, setOldPostsLimit ] = useState(15);

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
                    setError({ message: resp.detail, title: resp.title });
                }

                setLoadingData(false);
            }
		}
        fetchAsync();
	}, [ oldPostsLimit, AuthCtxt.currentUser ]);

    const addClockingNow = async () => {
        if (AuthCtxt.currentUser !== undefined) {
            setSendingApiData(true);
            const resp = await Api.addClocking({ userid: AuthCtxt.currentUser }, { direction: ((lastClocking?.direction ?? 'out' ) === 'in' ? 'out' : 'in')});
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
    
    return (
        <div className="row">
            <div className="col-12">
                <h2>Clockings</h2>
                {
                    (loadingData ? 
                        <Loadingspinner />
                    :
                        <>
                            {lastClocking !== null ? 
                                    <>
                                        <p key="status" className="lead">You are currently clocked <b>{lastClocking.direction ?? 'out'}</b>.</p>
                                        <p key="last-clock">You clocked {lastClocking.direction ?? 'out'} at {lastClocking.datetime.toLocaleString()}.</p>
                                    </>
                                :
                                    null
                            }
                            <Button disabled={sendingApiData} label={`Clock ${(lastClocking?.direction ?? 'out') === 'in' ? 'out' : 'in'}`} id='toggle-clocking' btnStyle={(lastClocking?.direction ?? 'out') === 'in' ? 'danger' : 'success' } onClick={addClockingNow} />
                            <hr />
                            {clockings?.map((val) => { return <p key={val["id"]}>{new Date(val["datetime"]).toLocaleString()} - {val["direction"]}</p> })}
                        </>
                    )
                }
            </div>
        </div>
    );
}

export default Clockings;