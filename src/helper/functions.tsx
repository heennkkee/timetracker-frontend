export const formatSeconds = (seconds: number, removeTime: number = 0, adaptTimesToReporting: boolean = false) => {
    if (seconds === 0) {
        return '';
    }

    if (adaptTimesToReporting) {
        let newSeconds = seconds - removeTime;
        let timeVal = Math.round(Math.abs(newSeconds) * 100 / 3600) / 100;
        const prefix = (timeVal === 0) ? '' : (newSeconds > 0) ? <span className="text-success fw-bold">+</span> : <span className="text-danger fw-bold">-</span>;
        return <>{prefix} {timeVal}h</>;
    } else {
        let hours = Math.floor(seconds / 3600);
        let minutes = Math.round((seconds - hours * 3600) / 60);
        return `${hours}h${minutes}m`;
    }
}   