import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Theme, ThemeContext } from "../context/ThemeContext";
import { formatSeconds } from "../helper/functions";
import { WorktimeReport } from "../helper/types";
import Input from "./Input";

type CalendarProps = {
    month: Date
    report: WorktimeReport
}

const Calendar = ({ month, report }: CalendarProps) => {
    
    const ThemeCtxt = useContext(ThemeContext);
    const borderColorClass = ( ThemeCtxt.mode === Theme.Dark ) ? `border-white-50` : ``;

    const [ adaptTimesToReporting, setAdaptTimesToReporting ] = useState(false);
    
    const renderCalendar = () => {
        let to = new Date(new Date(new Date(month).setMonth(new Date(month).getMonth() + 1)).setDate(0)).getDate();
        
        let firstWeekday = new Date(new Date(month).setDate(1)).getDay();
        
        let monthStr = new Date(month).toISOString().split('T')[0].split('-').splice(0, 2).join('-');
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
                
                let border = `border-bottom ${x === 0 ? 'border-top' : ''} border-end ${y === 0 ? 'border-start' : ''} ${borderColorClass}`;

                if (day >= to || day < 0) {

                    days.push(<div key={day} className={`col d-none d-lg-flex calendar-box disabled ${border}`}></div>);

                } else {
                    let ourDay = monthStr + '-' + (String(day + 1).length === 1 ? '0' : '') + String(day + 1);
                    let rep = report[ourDay];
                    

                    let content: JSX.Element[] = [];

                    content.push(<div className="mb-1 text-center mt-1 mt-lg-0"><i><small className={`${(rep?.isHoliday ?? false ? 'text-danger' : '')}`}><span className="d-none d-lg-inline">{new Date(ourDay).toLocaleDateString(undefined, { day: '2-digit' })}</span><span className="d-inline d-lg-none">{new Date(ourDay).toLocaleDateString(undefined, { day: '2-digit', weekday: 'long' })}</span></small></i></div>);

                    if (rep !== undefined && (rep.worktime > 0 || rep.scheduled > 0)) {
                        content.push(
                            <div className="row" key={1}>
                                { rep.worktime > 0 ? <div className={`col-12 mb-2`}>W: <i>{formatSeconds(rep.worktime, rep.scheduled, adaptTimesToReporting)}</i></div> : null }
                                {(rep.scheduled > 0 && rep.worktime === 0) ? <div className={`col-12 mb-2`}>S: <i>{formatSeconds((adaptTimesToReporting ? 0 : rep.scheduled), rep.scheduled, adaptTimesToReporting)}</i></div> : null}
                                <div className={`col-4 col-lg-12 mb-1`}><span className="small" style={{opacity: (rep.ob1 > 0 ? 1 : 0.5)}}>OB1:</span> <i>{formatSeconds(rep.ob1 === 0 ? undefined : rep.ob1, 0, adaptTimesToReporting)}</i></div>
                                <div className={`col-4 col-lg-12 mb-1`}><span className="small" style={{opacity: (rep.ob2 > 0 ? 1 : 0.5)}}>OB2:</span> <i>{formatSeconds(rep.ob2 === 0 ? undefined : rep.ob2, 0, adaptTimesToReporting)}</i></div>
                                <div className={`col-4 col-lg-12 mb-1`}><span className="small" style={{opacity: (rep.ob3 > 0 ? 1 : 0.5)}}>OB3:</span> <i>{formatSeconds(rep.ob3 === 0 ? undefined : rep.ob3, 0, adaptTimesToReporting)}</i></div>
                            </div>
                        );
                    }

                    days.push(<Link to={`/daydetails/${ourDay}`} key={day} className={`col-12 col-lg calendar-box ${border}`}>{content.map(el => el)}</Link>)
                }

                
            }

            ret.push(<div key={x} className='col-12'><div className="row">{days}</div></div>);
        }

        return ret;
    }

    return (
        <div className="col-12 mt-4">
            <Input label="Adapt times for reporting" type="checkbox" id="toggle" 
                value={null}
                checked={adaptTimesToReporting}
                setValue={setAdaptTimesToReporting}
            />
            <div className="row">
                {renderCalendar()}
            </div>
        </div>
    );
}

export default Calendar;