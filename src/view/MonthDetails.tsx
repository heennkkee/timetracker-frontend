import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Api from "../helper/Api";

import Loadingspinner from '../component/Loadingspinner';

import Input from "../component/Input";
import { useHistory, useParams } from "react-router-dom";
import Calendar from "../component/Calendar";
import { WorktimeReport, WorktimeSummary } from "../helper/types";
import { formatSeconds } from "../helper/functions";



const MonthDetails = () => {
    let { preSelectedMonth } = useParams<{ preSelectedMonth?: string }>();
    const useMonth = preSelectedMonth ?? new Date().toLocaleString('sv-SE', { year: 'numeric', month: '2-digit', day: '2-digit'});
    const history = useHistory();

    const [ loadingReport, setLoadingReport ] = useState<boolean>(true);

    const [ reportDetails, setReportDetails ] = useState<WorktimeReport>({});
    const [ reportSummary, setReportSummary ] = useState<null | WorktimeSummary >(null);

    const AuthCtxt = useContext(AuthContext);

	useEffect(() => {
		const fetchMonthReport = async () => {
            if (AuthCtxt.currentUser !== undefined) {

                let split = useMonth.split('-');
                split[split.length - 1] = '01';
                let fromDate = new Date(`${split.join('-')} 00:00:00`);

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
            {
                loadingReport ? 
                <Loadingspinner />
                :
                <>
                    <div className="col-12">
                        {reportSummary === null ? null : 
                            <div className="row">
                                <div className="col-12 col-lg-4">Work: {formatSeconds(reportSummary.worktime)}</div>
                                <div className="col-12 col-lg-8">Scheduled: {formatSeconds(reportSummary.scheduled)}</div>
                                <div className="col-4">OB1: {formatSeconds(reportSummary.ob1)}</div>
                                <div className="col-4">OB2: {formatSeconds(reportSummary.ob2)}</div>
                                <div className="col-4">OB3: {formatSeconds(reportSummary.ob3)}</div>
                            </div>
                        }
                    </div>
                    <Calendar month={new Date(useMonth)} report={reportDetails} />
                </>
            }
        </div>
    );
}

export default MonthDetails;