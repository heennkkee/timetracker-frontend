import { useContext, useEffect, useState } from "react";
import { Theme, ThemeContext } from "../context/ThemeContext";

import { Clocking } from '../helper/types';


type InputProps = {
    clockings: Clocking[],
    baseDate: Date
}

const Timeline = (props: InputProps) => {
    const ThemeCtxt = useContext(ThemeContext);
    
    const fillerBgColor = ( ThemeCtxt.mode === Theme.Dark ) ? 'background-darkgray' : 'background-lightgray';
    const timelineBase = ( ThemeCtxt.mode === Theme.Dark ) ? 'timeline-dark-' : 'timeline-';
    const textColor = ( ThemeCtxt.mode === Theme.Dark ) ? 'text-white-50' : '';

    const midnightSeconds = props.baseDate.setHours(0, 0, 0, 0);
    const secondsPerDay = 86400; // 3600s / hour * 24 hours

    const [ clockings, setClockings ] = useState<Clocking[]>([]);

    useEffect(() => {
        let temp: Clocking[] = JSON.parse(JSON.stringify(props.clockings));
        setClockings(temp.reverse())
    }, [props.clockings]);

    let bars: JSX.Element[] = [];

    clockings.forEach((clock, ix) => {
        let width;
        let color;
        let label = "";

        if (ix === 0) {
            let seconds = (new Date(clock["datetime"]).getTime() - midnightSeconds) / 1000;
            width = Math.floor(seconds * 100 / secondsPerDay);
            color = fillerBgColor;
        } else {
            let prevSeconds = (new Date(clockings[ix - 1]["datetime"]).getTime() - midnightSeconds) / 1000;
            let thisSeconds = (new Date(clock["datetime"]).getTime() - midnightSeconds) / 1000;
            label = `${Math.round((thisSeconds - prevSeconds) * 10 / 3600) / 10} h`;
            width = Math.floor((thisSeconds - prevSeconds) * 100 / secondsPerDay);
            color = timelineBase + (clock['direction'] === 'out' ? 'success' : 'danger');
        }

        bars.push(<div key={ix} className={`progress-bar ${color} ${textColor}`} style={{width: `${width}%`}}>{label}</div>);
    });

    return (
        <>
            <div className="row">
                <div className="col-12 d-flex justify-content-between">
                    <span>00:00</span>
                    <span>24:00</span>
                </div>
            </div>
            <div className={`progress ${fillerBgColor}`}>
                {bars.map(bar => { return bar; })}
            </div>
        </>
    )
}

export default Timeline;