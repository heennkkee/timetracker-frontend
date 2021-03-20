import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import Api from '../helper/Api';
import { Theme, ThemeContext } from '../context/ThemeContext';

import Loadingspinner from '../component/Loadingspinner';
import Errormessage, { Error } from '../component/Errormessage';

const UserList = () => {

    const [users, setUsers] = useState<null | any[]>(null);
    const [error, setError] = useState< Error | null >(null);
    const [loadingData, setLoadingData] = useState<boolean>(true);

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

	}, []);

    const ThemeCtxt = useContext(ThemeContext);
    const theme = ( ThemeCtxt.mode === Theme.Dark ) ? 'dark' : 'light';
    
    return (
        <div className="row">
            <div className="col-12">
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
        </div>
    )
}

export default UserList;