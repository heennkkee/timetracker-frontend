import React, { useEffect, useState } from 'react';
import Api from '../helper/Api';
import { useParams } from 'react-router-dom';
import Loadingspinner from '../component/Loadingspinner';
import Errormessage, { Error } from '../component/Errormessage';
import Input from '../component/Input'
import Button from '../component/Button'

import { useHistory } from 'react-router-dom';

const User = () => {
    let history = useHistory();

    const [user, setUser] = useState<null | { id: number, name: string, email: string }>(null);
    const [loadingError, setLoadingError] = useState<Error | null>(null);
    const [apiReplyError, setApiReplyError] = useState<Error | null>(null);
    const [loadingData, setLoadingData] = useState<boolean>(true);

    const [ sendingApiReply, setSendingApiReply ] = useState(false);

    const { userId } = useParams<{ userId: string }>();

	useEffect(() => {
		const fetchAsync = async () => {
			const resp = await Api.loadUser(parseInt(userId));
            if (resp.status === 200) {
                setUser(resp.data);
            } else {
                setLoadingError({ message: resp.detail, title: resp.title });
            }

            setLoadingData(false);
		}
		
		fetchAsync();

	}, [ userId ]);

    const updateUser = async(ev: React.FormEvent) => {
        ev.preventDefault();

        if (user !== null) {
            setSendingApiReply(true);
    
            const resp = await Api.updateUser( { userid: parseInt(userId) }, { name: user.name, email: user.email });
            setSendingApiReply(false);
    
            
            if (resp.status !== 200) {
                setApiReplyError({ title: resp.title, message: resp.detail });
            }
        }
    };

    const setPassword = async() => {
        const oldPassword = prompt('Old password');
        const newPassword = prompt('Old password');

        if (oldPassword !== null && newPassword !== null && oldPassword !== '' && newPassword !== '') {
            setApiReplyError(null);
            setSendingApiReply(true);
            const resp = await Api.updateUserPassword({ userid: parseInt(userId) }, { newPassword: newPassword, password: oldPassword });
            if (resp.status !== 200) {
                setApiReplyError({ title: resp.title, message: resp.detail });
            }
            setSendingApiReply(false);
        } else {
            setApiReplyError({ title: 'Missing data', message: 'Both passwords are required!'});
        }
    }

    const removeUser = async() => {
        if (user !== null) {
            const conf = window.confirm(`Are you sure you want to remove the user '${user.name}'?`);
            if (conf) {
                setApiReplyError(null);
                setSendingApiReply(true);
                const resp = await Api.removeUser({ userid: parseInt(userId )});
                if (resp.status === 200) {
                    history.replace('/users');
                } else {
                    setSendingApiReply(false);
                    setApiReplyError({ title: resp.title, message: resp.detail });
                }
            }
        }
    }

    


    return (
        <div className="row">
            <div className="col-12">
                {
                    (loadingData) ? 
                        <Loadingspinner />
                    : 
                    (loadingError !== null) ? 
                        <Errormessage error={loadingError} />
                    :
                    <>
                        <form onSubmit={updateUser}>
                            <Input id="name-input" label="Name" type="string" value={user?.name ?? ""} required={true} setValue={(name: string) => {
                                setUser((user: any) => ({ ...user, name: name}));
                            }} />
                            <Input id="email-input" label="Email" type="string" value={user?.email ?? ""} required={true} setValue={(email: string) => {
                                setUser((user: any) => ({ ...user, email: email}));
                            }} />
                            <div className="mb-3">
                                <Button type="submit" disabled={loadingData || sendingApiReply} btnStyle="success" label="Update" id="update-button" onClick={() => {}} />
                                <Button btnStyle="info" disabled={loadingData || sendingApiReply} label="Change password" id="change-password-button" onClick={setPassword} />
                                <Button btnStyle="danger" disabled={loadingData || sendingApiReply} label="Remove user" id="remove-user-button" onClick={removeUser} />
                            </div>
                        </form>
                    </>
                }
            </div>
            { (apiReplyError !== null ) ?
                    <div className="col-12">
                        <Errormessage error={apiReplyError} />
                    </div>
                :
                    null
            }
        </div>
    )
}

export default User;