import { paths } from './api-schema';

const APIURL = process.env.NODE_ENV === 'development' ?  
'http://localhost:5000/api' :
'https://ha-timetracker-backend.herokuapp.com/api';



type USERS_GET_200 = paths["/users/{id}"]["get"]["responses"]["200"]["schema"];
type USERS_GET_404 = paths["/users/{id}"]["get"]["responses"]["404"]["schema"];

type USERS_LIST_200 = paths["/users"]["get"]["responses"]["200"]["schema"];

class Api {

    static loadUser = async (id: number) => {
        const resp = await fetch(`${APIURL}/users/${id}`).then(resp => resp.json()).then((jsonResp: USERS_GET_200 | USERS_GET_404) => {
            return jsonResp;
        }).catch((err) => {
            return { success: false, data: { message: `Generic error: ${err.message}.`}};
        });

        return resp;
    }

    static loadUsers = async () => {
        const resp = await fetch(`${APIURL}/users`).then(resp => resp.json()).then((jsonResp: USERS_LIST_200) => {
            return jsonResp;
        }).catch((err) => {
            return { success: false, data: [], error: { message: `Generic error: ${err.message}.`}};
        });

        return resp;
    }
}

export default Api;