//npx openapi-typescript ../timetracker-backend/API-spec.yaml --output src/helper/api-schema.ts

import { paths } from './api-schema';

const APIURL = process.env.NODE_ENV === 'development' ?  
'http://localhost:5000/api' :
'https://ha-timetracker-backend.herokuapp.com/api';



type USERS_GET_200 = paths["/users/{userid}"]["get"]["responses"]["200"]["content"]["application/json"];
type USERS_GET_404 = paths["/users/{userid}"]["get"]["responses"]["404"]["content"]["application/json"];

type USERS_PUT_BODY = paths["/users/{userid}"]["put"]["requestBody"]["content"]["application/json"];
type USERS_PUT_PATH = paths["/users/{userid}"]["put"]["parameters"]["path"];
type USERS_PUT_200 = paths["/users/{userid}"]["put"]["responses"]["200"]["content"]["application/json"];
type USERS_PUT_404 = paths["/users/{userid}"]["put"]["responses"]["404"]["content"]["application/json"];


type USERS_LIST_200 = paths["/users"]["get"]["responses"]["200"]["content"]["application/json"];


type GENERIC_ERROR = {
    status: 500,
    detail: string,
    title: string
}



class Api {

    static loadUser = async (userid: number) => {
        const resp = await fetch(`${APIURL}/users/${userid}`, { credentials: 'include' }).then(resp => resp.json()).then((jsonResp: USERS_GET_200 | USERS_GET_404) => {
            return jsonResp;
        }).catch((err) => {
            return { status: 500, detail: `Generic error: ${err.message}.`, title: 'Error' } as GENERIC_ERROR;
        });

        return resp;
    }

    static updateUser = async (path: USERS_PUT_PATH, user: USERS_PUT_BODY) => {
        const resp = await fetch(`${APIURL}/users/${path.userid}`, { credentials: 'include', method: 'PUT', headers: { 'Content-Type': 'application/json'}, body: JSON.stringify(user) })
            .then(resp => resp.json())
            .then((json: USERS_PUT_200 | USERS_PUT_404) => {
                return json;
        }).catch((err) => {
            return { status: 500, detail: `Generic error: ${err.message}.`, title: 'Error' } as GENERIC_ERROR;
        })

        return resp;
    }

    static loadUsers = async () => {
        const resp = await fetch(`${APIURL}/users`, { credentials: 'include' }).then(resp => resp.json()).then((jsonResp: USERS_LIST_200) => {
            return jsonResp;
        }).catch((err) => {
            return { status: 500, detail: `Generic error: ${err.message}.`, title: 'Error' } as GENERIC_ERROR;
        });

        return resp;
    }

    static login = async () => {
		const resp = await fetch(`${APIURL}/auth/1/login`, { headers: { 'Content-Type': 'application/json' }, credentials: 'include', method: 'POST', body: JSON.stringify({ 'password': 'test' })}).then(resp => resp.json()).then(json => {
			console.log(json);
			return (json.data.session);
		});

        return resp;
	}

	static logout = async (session: string) => {
		const resp = await fetch(`${APIURL}/auth/1/logout`, { headers: { 'Content-Type': 'application/json' }, credentials: 'include', method: 'POST', body: JSON.stringify({ "session": session })}).then(resp => resp.json()).then(json => {
			return json;
		});

        return resp;
	}

}

export default Api;