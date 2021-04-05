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
                    console.log(resp.data);
                    setClockings(resp.data);
                } else {
                    //setError({ message: resp.detail, title: resp.title });
                }

                setLoadingClockings(false);
            }
		}
        
        fetchTodaysClockingsAsync();
	}, [ AuthCtxt.currentUser, selectedMonth ]);
    
    const renderCalendar = () => {
        let to = new Date(new Date(new Date(selectedMonth).setMonth(new Date(selectedMonth).getMonth() + 1)).setDate(0)).getDate();
        
        let firstWeekday = new Date(new Date(selectedMonth).setDate(1)).getDay();
        
        let offsetDays;
        switch (firstWeekday) {
            case 0:
                offsetDays = 6;
                break;
            default:
                offsetDays = firstWeekday - 1;
                break;
        }
        let renderDays = to + offsetDays;

        let rows = Math.ceil(renderDays / 7);

        let ret = [];
        for (let x = 0; x < rows; x++) {
            let days = [];
            for (var y = 0; y < 7; y++) {
                let day = (x * 7) + y - offsetDays;
                
                let text;
                if (day >= to || day < 0) {
                    text = '-';
                } else {
                    text = day + 1;
                    console.log(filterDateRange(new Date('2021-03-' + (day + 1)), new Date('2021-03-' + (day + 2))));
                }

                days.push(<div className="col calendar-box border-end">{text}</div>)
            }

            let className = 'col-12 border-top border-start';

            if (x === rows - 1) {
                className += ' border-bottom';
            }

            ret.push(<div className={className}><div className="row">{days}</div></div>);
        }

        return ret;
    }

    const filterDateRange = (from: Date, to: Date) => {
        console.log("filtering from ", from, " to ", to);
        return clockings?.filter((val) => {
            let date = new Date(val.datetime);
            return (date >= from && date < to);
        })
    }

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
                <h4>Calendar</h4>
                <div className="row">
                    {renderCalendar()}
                </div>
            </div>
            <div className="col-12 mt-4">
                <h4>Table</h4>
                { loadingClockings ? <Loadingspinner /> : (clockings !== null ? <ClockingsTable clockings={clockings} /> : null )}
            </div>
        </div>
    );
}

export default MonthDetails;