import { useEffect, useState, useContext } from 'react';
import Api from '../component/Api';
import { useParams } from 'react-router-dom';
import { Theme, ThemeContext } from '../context/ThemeContext';


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
                if (resp.data !== undefined && resp.data.message !== undefined) {
                    setError(resp.data.message ?? 'Something really shady went wrong..');
                }
            }

            setLoadingData(false);
		}
		
		fetchAsync();

	}, [ userId ]);

    
    const ThemeCtxt = useContext(ThemeContext);
    const theme = ( ThemeCtxt.mode === Theme.Dark ) ? 'dark' : 'light';
    const themeInverse = ( ThemeCtxt.mode === Theme.Dark ) ? 'light' : 'dark';
    

    return (
        <div className="row">
            <div className="col-12">
                <h2>User</h2>
                {
                    (loadingData) ? 
                    <div className="d-flex justify-content-center">
                        <div className={`spinner-border text-${themeInverse}`} role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                    : 
                    (error !== "") ? 
                        <p>{error}</p>
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
                                    
                                }} />
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label htmlFor="userEmail" className="col-sm-2 col-form-label">User ID</label>
                            <div className="col-sm-10">
                                <input type="email" className={`form-control bg-${theme} text-${themeInverse}`} id="userEmail" value={user.email} onChange={(ev) => {
                                    
                                }} />
                            </div>
                        </div>
                    </>
                }
            </div>
        </div>
    )
}

export default User;