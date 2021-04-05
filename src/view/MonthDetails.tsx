import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Api from "../helper/Api";

import Loadingspinner from '../component/Loadingspinner';

import Input from "../component/Input";

type WorktimeReport = {
    worktime: number,
    ob1: number,
    ob2: number,
    ob3: number
}

const MonthDetails = () => {
    const [ loadingReport, setLoadingReport ] = useState<boolean>(true);

    const [ selectedMonth, setSelectedMonth ] = useState<string>(() => {
        return new Date().toISOString().split('T')[0];
    });

    const [ report, setReport ] = useState<null | { [key: string]: WorktimeReport }>(null);

    const AuthCtxt = useContext(AuthContext);

	useEffect(() => {
		const fetchMonthReport = async () => {
            if (AuthCtxt.currentUser !== undefined) {
                let fromDate = new Date(selectedMonth);
                fromDate.setUTCDate(1);
                fromDate.setUTCHours(0, 0, 0, 0);

                let toDate = new Date(fromDate.getTime());
                toDate.setMonth(toDate.getMonth() + 1);

                setLoadingReport(true);
                const resp = await Api.getWorktimeReport({ userid: AuthCtxt.currentUser }, { since: fromDate.toJSON(), to: toDate.toJSON() });
 
                if (resp.status === 200) {
                    setReport(resp.data);
                    
                } else {
                    //setError({ message: resp.detail, title: resp.title });
                }

                setLoadingReport(false);
            }
		}

        
        fetchMonthReport();
	}, [ AuthCtxt.currentUser, selectedMonth ]);
    
    const renderCalendar = () => {
        let to = new Date(new Date(new Date(selectedMonth).setMonth(new Date(selectedMonth).getMonth() + 1)).setDate(0)).getDate();
        
        let firstWeekday = new Date(new Date(selectedMonth).setDate(1)).getDay();
        
        let monthStr = new Date(selectedMonth).toISOString().split('T')[0].split('-').splice(0, 2).join('-');
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
                
                let content: JSX.Element[] = [];
                if (day >= to || day < 0) {

                } else {
                    content.push(<p key={0}>{day + 1}</p>)

                    let ourDay = monthStr + '-' + (String(day + 1).length === 1 ? '0' : '') + String(day + 1);
                    if (report !== null) {
                        let rep = report[ourDay];
                        if (rep !== undefined) {
                            content.push(<p key={1}>{Math.round(rep.worktime * 10 / 3600) / 10} h</p>);
                        }
                    }
                }

                days.push(<div className="col calendar-box border-end">{content.map(el => el)}</div>)
            }

            let className = 'col-12 border-top border-start';

            if (x === rows - 1) {
                className += ' border-bottom';
            }

            ret.push(<div className={className}><div className="row">{days}</div></div>);
        }

        return ret;
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
                <div className="row">
                    {loadingReport ? <Loadingspinner /> : renderCalendar()}
                </div>
            </div>
        </div>
    );
}

export default MonthDetails;