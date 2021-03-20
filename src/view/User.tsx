import React, { useEffect, useState } from 'react';
import Api from '../helper/Api';
import { useParams } from 'react-router-dom';
import Loadingspinner from '../component/Loadingspinner';
import Errormessage, { Error } from '../component/Errormessage';
import Input from '../component/Input'
import Button from '../component/Button'

const User = () => {
    const [user, setUser] = useState<null | any>(null);
    const [loadingError, setLoadingError] = useState<Error | null>(null);
    const [saveError, setSaveError] = useState<Error | null>(null);
    const [loadingData, setLoadingData] = useState<boolean>(true);

    const [ sendApiReply, setSendingApiReply ] = useState(false);

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

        setSendingApiReply(true);

        const resp = await Api.updateUser( { userid: parseInt(userId) }, { name: user.name, email: user.email });
        setSendingApiReply(false);

        
        if (resp.status !== 200) {
            setSaveError({ title: resp.title, message: resp.detail });
        }
    };    

    


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
                            <Input id="name-input" label="Name" type="string" value={user.name} required={true} setValue={(name: string) => {
                                setUser((user: any) => ({ ...user, name: name}));
                            }} />
                            <Input id="email-input" label="Email" type="string" value={user.email} required={true} setValue={(email: string) => {
                                setUser((user: any) => ({ ...user, email: email}));
                            }} />
                            <div className="mb-3">
                                <Button type="submit" disabled={loadingData || sendApiReply} btnStyle="success" label="Save" id="save-button" onClick={() => {}} />
                            </div>
                        </form>
                    </>
                }
            </div>
            { (saveError !== null ) ?
                    <div className="col-12">
                        <Errormessage error={saveError} />
                    </div>
                :
                    null
            }
        </div>
    )
}

export default User;