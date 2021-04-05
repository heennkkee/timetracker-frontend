import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Api from "../helper/Api";

import Loadingspinner from '../component/Loadingspinner';
import ClockingsTable from "../component/ClockingsTable";

import { Clocking } from '../helper/types';
import Input from "../component/Input";


const MonthDetails = () => {
    const [ clockings, setClockings ] = useState<null | Clocking[]>(null);
    const [ loadingClockings, setLoadingClockings ] = useState<boolean>(true);

    const [ selectedMonth, setSelectedMonth ] = useState<string>(() => {
        return new Date().toISOString().split('T')[0];
    });

    const AuthCtxt = useContext(AuthContext);

	useEffect(() => {
		const fetchTodaysClockingsAsync = async () => {
            if (AuthCtxt.currentUser !== undefined) {
                let fromDate = new Date(selectedMonth);
                fromDate.setUTCDate(1);
                fromDate.setUTCHours(0, 0, 0, 0);

                let toDate = new Date(fromDate.getTime());
                toDate.setMonth(toDate.getMonth() + 1);

                setLoadingClockings(true);
                const resp = await Api.loadClockings({ userid: AuthCtxt.currentUser }, { since: fromDate.toJSON(), to: toDate.toJSON() });
                if (resp.status === 200) {
                    setClockings(resp.data);
                } else {
                    //setError({ message: resp.detail, title: resp.title });
                }

                setLoadingClockings(false);
            }
		}
        
        fetchTodaysClockingsAsync();
	}, [ AuthCtxt.currentUser, selectedMonth ]);

    return (
        <div className="row">
            <div className="col-12">
                <h2>Details for {new Date(selectedMonth).toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
                <Input label="Month" type="month" id="selected-month-input" 
                    value={`${selectedMonth.split('-')[0]}-${selectedMonth.split('-')[1]}`} 
                    setValue={(val: string) => {
                        setSelectedMonth(val + '-01');
                    }} />
            </div>
            <div className="col-12 mt-4">
                <h4>Table</h4>
                { loadingClockings ? <Loadingspinner /> : (clockings !== null ? <ClockingsTable clockings={clockings} /> : null )}
            </div>
        </div>
    );
}

export default MonthDetails;