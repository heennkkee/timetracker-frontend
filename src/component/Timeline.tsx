import { useContext, useEffect, useState } from "react";
import { Theme, ThemeContext } from "../context/ThemeContext";

import { Clocking } from '../helper/types';


type InputProps = {
    clockings: Clocking[],
    baseDate: Date
}

type Bar = {
    relativeWidth: number,
    color: string,
    label: string
}

const Timeline = (props: InputProps) => {
    const ThemeCtxt = useContext(ThemeContext);
    
    const fillerBgColor = ( ThemeCtxt.mode === Theme.Dark ) ? 'background-darkgray' : 'background-lightgray';
    
    const textColor = ( ThemeCtxt.mode === Theme.Dark ) ? 'text-white-50' : '';

    const [ fromTime, setFromTime ] = useState('00:00');
    const [ toTime, setToTime ] = useState('24:00');

    const [ bars, setBars ] = useState<Bar[]>([]);

    const secondsPerDay = 86400; // 3600s / hour * 24 hours
    const timelineBase = ( ThemeCtxt.mode === Theme.Dark ) ? 'timeline-dark-' : 'timeline-';

    const [ clockings, setClockings ] = useState<Clocking[]>([]);

    useEffect(() => {
        let temp: Clocking[] = JSON.parse(JSON.stringify(props.clockings));
        setClockings(temp.reverse())
    }, [props.clockings]);


    useEffect(() => {
        let tempDate = new Date(props.baseDate);

        const midnightSeconds = tempDate.setHours(0, 0, 0, 0);

        let tempBars: Bar[] = [];
        clockings.forEach((clock, ix) => {
            let width;
            let color;
            let label = "";
    
            if (ix === 0) {
                if (clock['direction'] === 'out') {
                    let seconds = (new Date(clock["datetime"]).getTime() - midnightSeconds) / 1000;
                    width = Math.floor(seconds * 100 / secondsPerDay);
                    color = timelineBase + 'success';
                    let hours = Math.floor(seconds / 3600);
                    let minutes = Math.floor(seconds - hours * 3600) / 60;
                    label = `${hours}h${minutes}m`;

                    tempBars.push({
                        relativeWidth: width,
                        color: color,
                        label: label
                    });

                } else {
                    setFromTime(new Date(clock['datetime']).toLocaleString('default', { hour: '2-digit', minute: '2-digit'}));
                    return;
                }
            } else {
                let prevSeconds = (new Date(clockings[ix - 1]["datetime"]).getTime() - midnightSeconds) / 1000;
                let thisSeconds = (new Date(clock["datetime"]).getTime() - midnightSeconds) / 1000;
                let barDuration = (thisSeconds - prevSeconds);
                let hours = Math.floor(barDuration / 3600);
                let minutes = Math.floor(barDuration - hours * 3600) / 60;
                label = `${hours}h${minutes}m`;
                width = Math.floor((thisSeconds - prevSeconds) * 100 / secondsPerDay);
                color = timelineBase + (clock['direction'] === 'out' ? 'success' : 'danger');

                tempBars.push({
                    relativeWidth: width,
                    color: color,
                    label: label
                });

                if (ix === clockings.length - 1) {
                    if (clock['direction'] === 'in') {
                        let prevSeconds = (new Date(clock["datetime"]).getTime() - midnightSeconds) / 1000;
                        let thisSeconds = (tempDate.setDate(tempDate.getDate() + 1) - midnightSeconds) / 1000;
                        let barDuration = (thisSeconds - prevSeconds);
                        let hours = Math.floor(barDuration / 3600);
                        let minutes = Math.floor(barDuration - hours * 3600) / 60;
                        tempBars.push({
                            relativeWidth: Math.floor((thisSeconds - prevSeconds) * 100 / secondsPerDay),
                            color: timelineBase + 'success',
                            label: `${hours}h${minutes}m`
                        });

                    } else {
                        setToTime(new Date(clock['datetime']).toLocaleString('default', { hour: '2-digit', minute: '2-digit'}));
                    }
                }
            }
        });
        setBars(tempBars);
    }, [ clockings, props.baseDate, timelineBase ]);

    let widthSum = 0;
    bars.forEach((bar) => widthSum += bar.relativeWidth);
    console.log("widthSuM", widthSum);
    return (
        <>
            <div className="row">
                <div className="col-12 d-flex justify-content-between">
                    <span>{fromTime}</span>
                    <span>{toTime}</span>
                </div>
            </div>
            <div className={`progress ${fillerBgColor}`}>
                {
                bars.map((bar, ix) => { 
                    console.log(bar.relativeWidth, widthSum / bar.relativeWidth);
                    return <div key={ix} className={`progress-bar ${bar.color} ${textColor}`} style={{width: `${(100 / widthSum) * bar.relativeWidth}%`}}>{bar.label}</div> 
                })
                }
            </div>
        </>
    )
}

export default Timeline;