//const APIURL = 'http://localhost:5000';
const APIURL = 'https://ha-timetracker-backend.herokuapp.com'

class Api {

    load = () => {
        return 1;
    }

    static loadUser = async (id: number) => {
        const resp = await fetch(`${APIURL}/users/${id}`).then(resp => resp.json()).then(jsonResp => {
            return jsonResp;
        }).catch((err) => {
            console.error(err);
            return null;
        });

        return resp.data;
    }

    static loadUsers = async () => {
        const resp = await fetch(`${APIURL}/users`).then(resp => resp.json()).then(jsonResp => {
            console.log("jsonresp: ", jsonResp.data);
            return jsonResp;
        }).catch((err) => {
            console.error(err);
        });

        console.log(resp);
        return resp.data;
    }
}

export default Api;