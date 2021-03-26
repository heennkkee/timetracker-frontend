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
    const [ mfa, setMfa ] = useState<string>("");

    const [error, setError] = useState<Error | null>(null);

    const [loading, setLoading] = useState(false);

    const [ requestMfa, setRequestMfa ] = useState(false);
    
    const AuthCtxt = useContext(AuthContext);

    
	const performLogin = async(ev: React.FormEvent) => {
        setError(null);
        setLoading(true);
        ev.preventDefault();

        let credentials: { "password": string, "e-mail": string, "mfacode"?: number } = { "password": password, "e-mail": email }; 

        if (mfa !== '') {
            credentials["mfacode"] = parseInt(mfa);
        }

        const resp = await Api.login(credentials);
        
        setLoading(false);

        if (resp.status === 200) { 
            AuthCtxt.setCurrentUser(resp.data.userid);
            Cookies.set("userid", String(resp.data.userid));
            AuthCtxt.setSession(resp.data.session);
        } else if (resp.status === 403) {
            if (resp.detail === "2fa") {
                setRequestMfa(true);
            }
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
                { !requestMfa ? 
                        <form onSubmit={performLogin}>
                            <Input label="Email address" type="email" id="email-input" value={email} required={true} setValue={setEmail} autoComplete="username" />
                            <Input label="Password" type="password" id="password-input" value={password} required={true} setValue={setPassword} autoComplete="current-password" />
                            <div className="mb-3">
                                <Button type="submit" disabled={loading} btnStyle="success" label="Login" id="login-button" onClick={() => {}} />
                            </div>
                        </form>
                    :
                    <form onSubmit={performLogin}>
                        <Input label="Multifactor code" type="number" id="mfa-input" value={mfa} required={true} setValue={setMfa} autoComplete="one-time-code" />
                        <div className="mb-3">
                            <Button type="submit" disabled={loading} btnStyle="success" label="Login" id="login-button" onClick={() => {}} />
                        </div>
                    </form>
                }
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