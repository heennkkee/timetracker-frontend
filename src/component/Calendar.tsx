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
                
                if (day >= to || day < 0) {

                    days.push(<div key={day} className={`col calendar-box disabled border-end ${borderColorClass}`}></div>);

                } else {
                    let ourDay = monthStr + '-' + (String(day + 1).length === 1 ? '0' : '') + String(day + 1);
                    
                    let content: JSX.Element[] = [];

                    content.push(<i><small>{day + 1}</small></i>);

                    let rep = report[ourDay];
                    if (rep !== undefined) {
                        content.push(
                            <ul className="list-unstyled" key={1}>
                                <li><span className="small">W:</span> {formatSeconds(rep.worktime, 8 * 3600, adaptTimesToReporting)}</li>
                                { (rep.ob1 > 0 || rep.ob2 > 0 || rep.ob3 > 0) ?
                                    <>
                                        <li><span className="small">OB1:</span> {formatSeconds(rep.ob1, 0, adaptTimesToReporting)}</li>
                                        <li><span className="small">OB2:</span> {formatSeconds(rep.ob2, 0, adaptTimesToReporting)}</li>
                                        <li><span className="small">OB3:</span> {formatSeconds(rep.ob3, 0, adaptTimesToReporting)}</li>
                                    </>
                                    : null
                                }
                            </ul>
                        );
                    }

                    days.push(<Link to={`/daydetails/${ourDay}`} key={day} className={`col calendar-box border-end ${borderColorClass}`}>{content.map(el => el)}</Link>)
                }

                
            }

            let className = `col-12 border-top border-start ${borderColorClass}`;

            if (x === rows - 1) {
                className += ' border-bottom';
            }

            ret.push(<div key={x} className={className}><div className="row">{days}</div></div>);
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