import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import Api from '../helper/Api';
import { Theme, ThemeContext } from '../context/ThemeContext';

import Loadingspinner from '../component/Loadingspinner';
import Errormessage, { Error } from '../component/Errormessage';
import Button from '../component/Button';

const UserList = () => {

    const [users, setUsers] = useState<null | any[]>(null);
    const [error, setError] = useState< Error | null >(null);
    const [loadingData, setLoadingData] = useState<boolean>(true);

    const [ sendingApiReply, setSendingApiReply ] = useState(false);
    const [ apiError, setApiError ] = useState<Error | null>(null);



	useEffect(() => {
		const fetchAsync = async () => {
			const resp = await Api.loadUsers();
            if (resp.status === 200) {
                setUsers(resp.data);
            } else {
                setError({ message: resp.detail, title: resp.title });
            }
            setLoadingData(false);
		}
		
		fetchAsync();

	}, [ ]);

    const addUser = async () => {

        const name = prompt('User\'s name');
        if (name === "" || name === null) {
            return;
        }

        const email = prompt('User\'s email');
        if (email === "" || email === null) {
            return;
        }
        
        const password = prompt('User\'s password');
        if (password === "" || password === null) {
            return;
        }

        setApiError(null);
        setSendingApiReply(true);
        
        const resp = await Api.addUser({ name: name, email: email, password: password });
        setSendingApiReply(false);
        
        if (resp.status !== 201) {
            setApiError({ title: resp.title, message: resp.detail });
        } else {
            setLoadingData(true);
            const usersResp = await Api.loadUsers();
            if (usersResp.status === 200) {
                setUsers(usersResp.data);
            } else {
                setError({ message: usersResp.detail, title: usersResp.title });
            }
            setLoadingData(false);
        }
    }

    const ThemeCtxt = useContext(ThemeContext);
    const theme = ( ThemeCtxt.mode === Theme.Dark ) ? 'dark' : 'light';


    
    return (

        <div className="row">
            <div className="col-12 mb-3">
                <div className="list-group">
                    {
                        (loadingData) ? 
                            <Loadingspinner />
                        : error !== null ?
                            <Errormessage error={error} />
                        :  users !== null ?
                            users.map(user => {
                                return <Link to={`/users/${user.id}`} key={user.id} className={`list-group-item list-group-item-${theme} list-group-item-action`}>{user.name}</Link>
                            })
                        : null
                    }
                </div>
            </div>
            <div className="col-12 mb-3">
                <Button disabled={loadingData || sendingApiReply} id="add-user-button" label="Add user" onClick={addUser} btnStyle="info" />
            </div>
            { apiError !== null ? 
                    <div className="col-12 mb-3">
                        <Errormessage error={apiError} />
                    </div>
                :
                    null
            }
        </div>
        
    )
}

export default UserList;