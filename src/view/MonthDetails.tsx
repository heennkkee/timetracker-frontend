import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Api from "../helper/Api";

import Loadingspinner from '../component/Loadingspinner';

import Input from "../component/Input";
import { useHistory, useParams, Link } from "react-router-dom";
import Calendar from "../component/Calendar";
import { Worktime, WorktimeReport } from "../helper/types";
import { formatSeconds } from "../helper/functions";



const MonthDetails = () => {
    let { preSelectedMonth } = useParams<{ preSelectedMonth?: string }>();
    const useMonth = preSelectedMonth ?? new Date().toLocaleString('se-sv', { year: 'numeric', month: '2-digit', day: '2-digit'});
    const history = useHistory();

    const [ loadingReport, setLoadingReport ] = useState<boolean>(true);

    const [ reportDetails, setReportDetails ] = useState<WorktimeReport>({});
    const [ reportSummary, setReportSummary ] = useState<null | Worktime >(null);

    const [ adaptTimesToReporting, setAdaptTimesToReporting ] = useState(false);

    const AuthCtxt = useContext(AuthContext);

	useEffect(() => {
		const fetchMonthReport = async () => {
            if (AuthCtxt.currentUser !== undefined) {
                let fromDate = new Date(`${useMonth} 00:00:00`);

                let toDate = new Date(fromDate.getTime());
                toDate.setMonth(toDate.getMonth() + 1);

                setLoadingReport(true);
                const resp = await Api.getWorktimeReport({ userid: AuthCtxt.currentUser }, { since: fromDate.toJSON(), to: toDate.toJSON() });
 
                if (resp.status === 200) {
                    setReportDetails(resp.data.details);
                    setReportSummary(resp.data.summary);
                    
                } else {
                    //setError({ message: resp.detail, title: resp.title });
                }

                setLoadingReport(false);
            }
		}

        
        fetchMonthReport();
	}, [ AuthCtxt.currentUser, useMonth ]);

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
            <div className="col-12">
                {reportSummary !== null ? 
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item bg-transparent">Work: {formatSeconds(reportSummary?.worktime)}</li>
                        <li className="list-group-item bg-transparent">OB1: {formatSeconds(reportSummary?.ob1)}</li>
                        <li className="list-group-item bg-transparent">OB2: {formatSeconds(reportSummary?.ob2)}</li>
                        <li className="list-group-item bg-transparent">OB3: {formatSeconds(reportSummary?.ob3)}</li>
                    </ul>
                : null}
            </div>
            {loadingReport ? <Loadingspinner /> : <Calendar month={new Date(useMonth)} report={reportDetails} />}

        </div>
    );
}

export default MonthDetails;