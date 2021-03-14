import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import Api from '../component/Api';
import { Theme, ThemeContext } from '../context/ThemeContext';

const UserList = () => {

    const [users, setUsers] = useState<null | any[]>(null);
    const [error, setError] = useState<string>("");
    const [loadingData, setLoadingData] = useState<boolean>(true);

	useEffect(() => {
		const fetchAsync = async () => {
			const resp = await Api.loadUsers();
            if (resp.success) {
                setUsers(resp.data);
            } else {
                setError(resp.error.message);
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
                <h2>Users</h2>
                <div className="list-group">
                    {
                        (loadingData) ? 
                            <div className="d-flex justify-content-center">
                                <div className={`spinner-border text-${themeInverse}`} role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        : error !== "" || users === null ?
                            <p>{error}</p>
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