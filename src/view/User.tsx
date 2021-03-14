import { useEffect, useState, useContext } from 'react';
import Api from '../helper/Api';
import { useParams } from 'react-router-dom';
import { Theme, ThemeContext } from '../context/ThemeContext';
import Loadingspinner from '../component/Loadingspinner';
import Errormessage from '../component/Errormessage';


const User = () => {
    const [user, setUser] = useState<null | any>(null);
    const [error, setError] = useState<string>("");
    const [loadingData, setLoadingData] = useState<boolean>(true);

    const { userId } = useParams<{ userId: string }>();

	useEffect(() => {
		const fetchAsync = async () => {
			const resp = await Api.loadUser(parseInt(userId));
            if (resp.success) {
                setUser(resp.data);
            } else {
                if (resp.error !== undefined && resp.error.message !== undefined) {
                    setError(resp.error.message ?? 'Something really shady went wrong..');
                }
            }

            setLoadingData(false);
		}
		
		fetchAsync();

	}, [ userId ]);

    const updateUser = async () => {

        await Api.updateUser( { id: userId }, { name: user.name, email: user.email });
    }

    
    const ThemeCtxt = useContext(ThemeContext);
    const theme = ( ThemeCtxt.mode === Theme.Dark ) ? 'dark' : 'light';
    const themeInverse = ( ThemeCtxt.mode === Theme.Dark ) ? 'light' : 'dark';
    

    return (
        <div className="row">
            <div className="col-12">
                {
                    (loadingData) ? 
                        <Loadingspinner themeInverse={themeInverse} />
                    : 
                    (error !== "") ? 
                        <Errormessage message={error} />
                    :
                    <>
                        <div className="mb-3 row">
                            <label htmlFor="userId" className="col-sm-2 col-form-label">User ID</label>
                            <div className="col-sm-10">
                                <input type="number" readOnly disabled className={`form-control bg-${theme} text-${themeInverse}`} id="userId" value={user.id} />
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label htmlFor="userName" className="col-sm-2 col-form-label">Name</label>
                            <div className="col-sm-10">
                                <input type="text" className={`form-control bg-${theme} text-${themeInverse}`} id="userName" value={user.name} onChange={(ev) => {
                                    setUser((user: any) => ({ ...user, name: ev.target.value }));
                                }} />
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label htmlFor="userEmail" className="col-sm-2 col-form-label">User ID</label>
                            <div className="col-sm-10">
                                <input type="email" className={`form-control bg-${theme} text-${themeInverse}`} id="userEmail" value={user.email} onChange={(ev) => {
                                    setUser((user: any) => ({ ...user, email: ev.target.value }));
                                }} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-10 offset-sm-2">
                                <button type="submit" className="btn btn-success ml-auto" onClick={updateUser}>Save</button>
                            </div>

                        </div>
                    </>
                }
            </div>
        </div>
    )
}

export default User;