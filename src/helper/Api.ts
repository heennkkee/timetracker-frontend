//npx openapi-typescript ../timetracker-backend/API-spec.yaml --output src/helper/api-schema.ts

import { paths } from './api-schema';

const APIURL = process.env.NODE_ENV === 'development' ?  'http://localhost:5000/api' : '/api';



type USERS_GET_200 = paths["/users/{userid}"]["get"]["responses"]["200"]["content"]["application/json"];
type USERS_GET_404 = paths["/users/{userid}"]["get"]["responses"]["404"]["content"]["application/json"];

type USERS_PUT_BODY = paths["/users/{userid}"]["put"]["requestBody"]["content"]["application/json"];
type USERS_PUT_PATH = paths["/users/{userid}"]["put"]["parameters"]["path"];
type USERS_PUT_200 = paths["/users/{userid}"]["put"]["responses"]["200"]["content"]["application/json"];
type USERS_PUT_404 = paths["/users/{userid}"]["put"]["responses"]["404"]["content"]["application/json"];


type USERS_POST_BODY = paths["/users"]["post"]["requestBody"]["content"]["application/json"];
type USERS_POST_201 = paths["/users"]["post"]["responses"]["201"]["content"]["application/json"];
type USERS_POST_400 = paths["/users"]["post"]["responses"]["400"]["content"]["application/json"];

type USERS_LIST_200 = paths["/users"]["get"]["responses"]["200"]["content"]["application/json"];

type CHECK_200 = paths["/auth/check"]["get"]["responses"]["200"]["content"]["application/json"];
type CHECK_401 = paths["/auth/check"]["get"]["responses"]["401"]["content"]["application/json"];


type LOGIN_BODY = paths["/auth/login"]["post"]["requestBody"]["content"]["application/json"];
type LOGIN_200 = paths["/auth/login"]["post"]["responses"]["200"]["content"]["application/json"];
type LOGIN_403 = paths["/auth/login"]["post"]["responses"]["403"]["content"]["application/json"];
type LOGIN_401 = paths["/auth/login"]["post"]["responses"]["401"]["content"]["application/json"];

type LOGOUT_BODY = paths["/auth/logout"]["post"]["requestBody"]["content"]["application/json"];
type LOGOUT_200 = paths["/auth/logout"]["post"]["responses"]["200"]["content"]["application/json"];

type UPDATE_PASSWORD_BODY = paths["/users/{userid}/password"]["put"]["requestBody"]["content"]["application/json"];
type UPDATE_PASSWORD_PATH = paths["/users/{userid}/password"]["put"]["parameters"]["path"];
type UPDATE_PASSWORD_200 = paths["/users/{userid}/password"]["put"]["responses"]["200"]["content"]["application/json"];
type UPDATE_PASSWORD_401 = paths["/users/{userid}/password"]["put"]["responses"]["401"]["content"]["application/json"];
type UPDATE_PASSWORD_404 = paths["/users/{userid}/password"]["put"]["responses"]["404"]["content"]["application/json"];

type USER_REMOVE_PATH = paths["/users/{userid}"]["delete"]["parameters"]["path"]
type USER_REMOVE_200 = paths["/users/{userid}"]["delete"]["responses"]["200"]["content"]["application/json"];
type USER_REMOVE_404 = paths["/users/{userid}"]["delete"]["responses"]["404"]["content"]["application/json"];
type USER_REMOVE_500 = paths["/users/{userid}"]["delete"]["responses"]["500"]["content"]["application/json"];


type CLOCKINGS_GET_PATH = paths["/users/{userid}/clockings"]["get"]["parameters"]["path"];
type CLOCKINGS_GET_QS = paths["/users/{userid}/clockings"]["get"]["parameters"]["query"];
type CLOCKINGS_GET_200 = paths["/users/{userid}/clockings"]["get"]["responses"]["200"]["content"]["application/json"];
type CLOCKINGS_GET_404 = paths["/users/{userid}/clockings"]["get"]["responses"]["404"]["content"]["application/json"];


type CLOCKINGS_POST_PATH = paths["/users/{userid}/clockings"]["post"]["parameters"]["path"];
type CLOCKINGS_POST_BODY = paths["/users/{userid}/clockings"]["post"]["requestBody"]["content"]["application/json"];
type CLOCKINGS_POST_201 = paths["/users/{userid}/clockings"]["post"]["responses"]["201"]["content"]["application/json"];
type CLOCKINGS_POST_400 = paths["/users/{userid}/clockings"]["post"]["responses"]["400"]["content"]["application/json"];
type CLOCKINGS_POST_404 = paths["/users/{userid}/clockings"]["post"]["responses"]["404"]["content"]["application/json"];

type CLOCKINGS_DELETE_PATH = paths["/users/{userid}/clockings/{clockingid}"]["delete"]["parameters"]["path"];
type CLOCKINGS_DELETE_200 = paths["/users/{userid}/clockings/{clockingid}"]["delete"]["responses"]["200"]["content"]["application/json"];
type CLOCKINGS_DELETE_404 = paths["/users/{userid}/clockings/{clockingid}"]["delete"]["responses"]["404"]["content"]["application/json"];
type CLOCKINGS_DELETE_500 = paths["/users/{userid}/clockings/{clockingid}"]["delete"]["responses"]["500"]["content"]["application/json"];

type REPORT_PATH = paths["/users/{userid}/report"]["get"]["parameters"]["path"];
type REPORT_QUERY = paths["/users/{userid}/report"]["get"]["parameters"]["query"];
type REPORT_200 = paths["/users/{userid}/report"]["get"]["responses"]["200"]["content"]["application/json"];

type GENERIC_ERROR = {
    status: 500,
    detail: string,
    title: string
}



class Api {

    static getWorktimeReport = async(path: REPORT_PATH, query: REPORT_QUERY) => {
        let url = `${APIURL}/users/${path.userid}/report?since=${query.since}&to=${query.to}`;
        const resp = await fetch(url, { 
            headers: { 'Content-Type': 'application/json' }, 
            credentials: 'include'
        }).then(resp => resp.json()).then((json: REPORT_200 ) => {
            return json;
        }).catch((err) => {
            return { status: 500, detail: `Generic error: ${err.message}.`, title: 'Error' } as GENERIC_ERROR;
        });
        return resp;
    }

    static removeClocking = async(path: CLOCKINGS_DELETE_PATH) => {
        let url = `${APIURL}/users/${path.userid}/clockings/${path.clockingid}`;
        const resp = await fetch(url, { 
            headers: { 'Content-Type': 'application/json' }, 
            credentials: 'include', 
            method: 'DELETE'
        }).then(resp => resp.json()).then((json: CLOCKINGS_DELETE_200 | CLOCKINGS_DELETE_404 | CLOCKINGS_DELETE_500 ) => {
            return json;
        }).catch((err) => {
            return { status: 500, detail: `Generic error: ${err.message}.`, title: 'Error' } as GENERIC_ERROR;
        });
        return resp;
    }

    static addClocking = async(path: CLOCKINGS_POST_PATH, body: CLOCKINGS_POST_BODY) => {
        let url = `${APIURL}/users/${path.userid}/clockings`;
        const resp = await fetch(url, { 
            headers: { 'Content-Type': 'application/json' }, 
            credentials: 'include', 
            method: 'POST',
            body: JSON.stringify(body)
        }).then(resp => resp.json()).then((json: CLOCKINGS_POST_201 | CLOCKINGS_POST_400 | CLOCKINGS_POST_404 ) => {
            return json;
        }).catch((err) => {
            return { status: 500, detail: `Generic error: ${err.message}.`, title: 'Error' } as GENERIC_ERROR;
        });
        return resp;
    }

    static loadClockings = async(path: CLOCKINGS_GET_PATH, qs: CLOCKINGS_GET_QS) => {
        let limit = (qs.limit !== undefined) ? `limit=${qs.limit}` : '';
        let since = (qs.since !== undefined) ? `since=${qs.since}` : '';
        let to = (qs.to !== undefined) ? `to=${qs.to}` : '';

        let url = `${APIURL}/users/${path.userid}/clockings?${[limit, since, to].join('&')}`;
        const resp = await fetch(url, { 
            headers: { 'Content-Type': 'application/json' }, 
            credentials: 'include', 
            method: 'GET'
        }).then(resp => resp.json()).then((json: CLOCKINGS_GET_200 | CLOCKINGS_GET_404 ) => {
            return json;
        }).catch((err) => {
            return { status: 500, detail: `Generic error: ${err.message}.`, title: 'Error' } as GENERIC_ERROR;
        });
        return resp;
    }

    static removeUser = async(path: USER_REMOVE_PATH) => {
        const resp = await fetch(`${APIURL}/users/${path.userid}`, { 
            headers: { 'Content-Type': 'application/json' }, 
            credentials: 'include', 
            method: 'DELETE'
        }).then(resp => resp.json()).then((json: USER_REMOVE_200 | USER_REMOVE_404 | USER_REMOVE_500 ) => {
            return json;
        }).catch((err) => {
            return { status: 500, detail: `Generic error: ${err.message}.`, title: 'Error' } as GENERIC_ERROR;
        });
        return resp;
    }

    static addUser = async(body: USERS_POST_BODY) => {
        const resp = await fetch(`${APIURL}/users`, { 
            headers: { 'Content-Type': 'application/json' }, 
            credentials: 'include', 
            method: 'POST',
            body: JSON.stringify(body)
        }).then(resp => resp.json()).then((json: USERS_POST_201 | USERS_POST_400 ) => {
            return json;
        }).catch((err) => {
            return { status: 500, detail: `Generic error: ${err.message}.`, title: 'Error' } as GENERIC_ERROR;
        });
        return resp;
    }

    static updateUserPassword = async(path: UPDATE_PASSWORD_PATH, body: UPDATE_PASSWORD_BODY) => {
        const resp = await fetch(`${APIURL}/users/${path.userid}/password`, { 
            headers: { 'Content-Type': 'application/json' }, 
            credentials: 'include', 
            method: 'PUT',
            body: JSON.stringify(body)
        }).then(resp => resp.json()).then((json: UPDATE_PASSWORD_200 | UPDATE_PASSWORD_401 | UPDATE_PASSWORD_404 ) => {
            return json;
        }).catch((err) => {
            return { status: 500, detail: `Generic error: ${err.message}.`, title: 'Error' } as GENERIC_ERROR;
        });
        return resp;
    }

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

    static login = async (credentials: LOGIN_BODY) => {
		const resp = await fetch(`${APIURL}/auth/login`, { 
                headers: { 'Content-Type': 'application/json' }, 
                credentials: 'include', 
                method: 'POST', 
                body: JSON.stringify(credentials)
            }
        ).then(resp => resp.json()).then((json: LOGIN_200 | LOGIN_401 | LOGIN_403) => {
			return json;
		}).catch((err) => {
            return { status: 500, detail: `Generic error: ${err.message}.`, title: 'Error' } as GENERIC_ERROR;
        });

        return resp;
	}

	static logout = async (session: LOGOUT_BODY) => {
		const resp = await fetch(`${APIURL}/auth/logout`, { 
            headers: { 'Content-Type': 'application/json' }, 
            credentials: 'include', 
            method: 'POST', 
            body: JSON.stringify(session)
        }).then(resp => resp.json()).then((json: LOGOUT_200) => {
			return json;
		}).catch((err) => {
            return { status: 500, detail: `Generic error: ${err.message}.`, title: 'Error' } as GENERIC_ERROR;
        });

        return resp;
	}

    static check = async() => {
        const resp = await fetch(`${APIURL}/auth/check`, { headers: { 'Content-Type': 'application/json' }, credentials: 'include', method: 'GET'}).then(resp => resp.json()).then((json: CHECK_200 | CHECK_401) => {
            return json;
        }).catch((err) => {
            return { status: 500, detail: `Generic error: ${err.message}.`, title: 'Error' } as GENERIC_ERROR;
        });
        return resp;
    }

}

export default Api;
