import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import Api from '../helper/Api';
import { Theme, ThemeContext } from '../context/ThemeContext';

import Loadingspinner from '../component/Loadingspinner';
import Errormessage from '../component/Errormessage';

const UserList = () => {

    const [users, setUsers] = useState<null | any[]>(null);
    const [error, setError] = useState<string>("");
    const [loadingData, setLoadingData] = useState<boolean>(true);

	useEffect(() => {
		const fetchAsync = async () => {
			const resp = await Api.loadUsers();
            if (resp.success) {
                if (resp.data !== undefined) {
                    setUsers(resp.data);
                } else {
                    setError('Undefined response without error');
                }
            } else {
                if (resp.error !== undefined) {
                    setError(resp.error.message ?? 'Something really bad happened here..');
                } else {
                    setError('Response failed without error message');
                }
            }
            setLoadingData(false);
		}
		
		fetchAsync();

	}, []);

    const ThemeCtxt = useContext(ThemeContext);
    const theme = ( ThemeCtxt.mode === Theme.Dark ) ? 'dark' : 'light';
    const themeInverse = ( ThemeCtxt.mode === Theme.Dark ) ? 'light' : 'dark';
    
    return (
        <div className="row">
            <div className="col-12">
                <div className="list-group">
                    {
                        (loadingData) ? 
                            <Loadingspinner themeInverse={themeInverse} />
                        : error !== "" || users === null ?
                            <Errormessage message={error} />
                        :
                            users.map(user => {
                                return <Link to={`/users/${user.id}`} key={user.id} className={`list-group-item list-group-item-${theme} list-group-item-action`}>{user.name}</Link>
                            })
                    }
                </div>
            </div>
        </div>
    )
}

export default UserList;