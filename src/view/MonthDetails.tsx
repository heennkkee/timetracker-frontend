import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Api from "../helper/Api";

import Loadingspinner from '../component/Loadingspinner';

import Input from "../component/Input";
import { useHistory, useParams, Link } from "react-router-dom";

type WorktimeReport = {
    worktime: number,
    ob1: number,
    ob2: number,
    ob3: number
}

const MonthDetails = () => {
    let { preSelectedMonth } = useParams<{ preSelectedMonth?: string }>();
    const useMonth = preSelectedMonth ?? new Date().toISOString().split('T')[0];
    const history = useHistory();

    const [ loadingReport, setLoadingReport ] = useState<boolean>(true);

    const [ report, setReport ] = useState<null | { [key: string]: WorktimeReport }>(null);

    const [ adaptTimesToReporting, setAdaptTimesToReporting ] = useState(false);

    const AuthCtxt = useContext(AuthContext);

	useEffect(() => {
		const fetchMonthReport = async () => {
            if (AuthCtxt.currentUser !== undefined) {
                let fromDate = new Date(useMonth);
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
	}, [ AuthCtxt.currentUser, useMonth ]);
    
    const renderCalendar = () => {
        let to = new Date(new Date(new Date(useMonth).setMonth(new Date(useMonth).getMonth() + 1)).setDate(0)).getDate();
        
        let firstWeekday = new Date(new Date(useMonth).setDate(1)).getDay();
        
        let monthStr = new Date(useMonth).toISOString().split('T')[0].split('-').splice(0, 2).join('-');
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
                    let ourDay = monthStr + '-' + (String(day + 1).length === 1 ? '0' : '') + String(day + 1);

                    content.push(<i key={0}><small><Link to={`/daydetails/${ourDay}`}>{day + 1}</Link></small></i>)

                    if (report !== null) {
                        let rep = report[ourDay];
                        if (rep !== undefined) {
                            content.push(
                                <ul className="list-unstyled" key={1}>
                                    <li><span className="small">W:</span> {formatSeconds(rep.worktime, 8 * 3600)}</li>
                                    { (rep.ob1 > 0 || rep.ob2 > 0 || rep.ob3 > 0) ?
                                        <>
                                            <li><span className="small">OB1:</span> {formatSeconds(rep.ob1)}</li>
                                            <li><span className="small">OB2:</span> {formatSeconds(rep.ob2)}</li>
                                            <li><span className="small">OB3:</span> {formatSeconds(rep.ob3)}</li>
                                        </>
                                        : null
                                    }
                                </ul>
                            );
                        }
                    }
                }

                days.push(<div key={day} className="col calendar-box border-end">{content.map(el => el)}</div>)
            }

            let className = 'col-12 border-top border-start';

            if (x === rows - 1) {
                className += ' border-bottom';
            }

            ret.push(<div key={x} className={className}><div className="row">{days}</div></div>);
        }

        return ret;
    }

    const formatSeconds = (seconds: number, removeTime: number = 0) => {
        if (seconds === 0) {
            return '';
        }

        if (adaptTimesToReporting) {
            let newSeconds = seconds - removeTime; // remove 8 hours for workdays
            let timeVal = Math.round(Math.abs(newSeconds) * 100 / 3600) / 100;
            const prefix = (timeVal === 0) ? '' : (newSeconds > 0) ? <span className="text-success fw-bold">+</span> : <span className="text-danger fw-bold">-</span>;
            return <>{prefix} {timeVal}h</>;
        } else {
            let hours = Math.floor(seconds / 3600);
            let minutes = Math.round((seconds - hours * 3600) / 60);
            return `${hours}h${minutes}m`;
        }
    }

    return (
        <div className="row">
            <div className="col-12">
                <h2>Details for {new Date(useMonth).toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
                <Input label="Month" type="month" id="selected-month-input" 
                    value={`${useMonth.split('-')[0]}-${useMonth.split('-')[1]}`} 
                    setValue={(val: string) => {
                        history.push(`/month/${val + '-01'}`);
                    }} />
            </div>
            <div className="col-12 mt-4">
                <Input label="Adapt times for reporting" type="checkbox" id="toggle" 
                    value={null}
                    checked={adaptTimesToReporting}
                    setValue={setAdaptTimesToReporting}
                />
                <div className="row">
                    {loadingReport ? <Loadingspinner /> : renderCalendar()}
                </div>
            </div>
        </div>
    );
}

export default MonthDetails;