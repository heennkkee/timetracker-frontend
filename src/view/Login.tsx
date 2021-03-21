import React, { useState, useContext } from 'react';
import Errormessage, { Error } from '../component/Errormessage';
import Api from '../helper/Api';
import { AuthContext } from '../context/AuthContext';

import Input from '../component/Input';
import Button from '../component/Button';
import Cookies from '../helper/Cookies';

const Login = () => {
    
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    
    const [error, setError] = useState<Error | null>(null);

    const [loading, setLoading] = useState(false);
    
    const AuthCtxt = useContext(AuthContext);

    
	const performLogin = async(ev: React.FormEvent) => {
        setError(null);
        setLoading(true);
        ev.preventDefault();

        const resp = await Api.login({ "password": password, "e-mail": email});
        
        setLoading(false);

        if (resp.status === 200) {
            AuthCtxt.setCurrentUser(resp.data.userid);
            Cookies.set("userid", String(resp.data.userid));
            AuthCtxt.setSession(resp.data.session);
        } else {
            setError({ message: resp.detail, title: resp.title });
        }
    };    

    return (
        <div className="row">
            <div className="col-12">
                <h2>Login</h2>
                <p>Provide your credentials below to login.</p>
            </div>
            <div className="col-12">
                <form onSubmit={performLogin}>
                    <Input label="Email address" type="email" id="email-input" value={email} required={true} setValue={setEmail} />
                    <Input label="Password" type="password" id="password-input" value={password} required={true} setValue={setPassword} />
                    <div className="mb-3">
                        <Button type="submit" disabled={loading} btnStyle="success" label="Login" id="login-button" onClick={() => {}} />
                    </div>
                </form>
            </div>
            { error !== null ? 
                <div className="col-12">
                    <Errormessage error={error} />
                </div>
            : 
                null    
            }
        </div>
    )
}

export default Login;