import React, { useState, Suspense, useEffect } from 'react';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { ThemeContext, Theme } from './context/ThemeContext';
import Header from './view/Header';
import Footer from './view/Footer';

import API from './helper/Api';

import Cookies from './helper/Cookies';
import { AuthContext } from './context/AuthContext';

const User = React.lazy(() => import("./view/User"));
const UserList = React.lazy(() => import("./view/UserList"));
const FourOhFour = React.lazy(() => import("./view/FourOhFour"));
const Login = React.lazy(() => import("./view/Login"));

function App() {

	const [mode, setMode] = useState<Theme>(() => {
		let storedMode = Cookies.get('mode');
		let setTheme = Theme.Light;
	
		if (storedMode !== undefined && Object.keys(Theme).includes(storedMode as Theme)) {
			setTheme = Theme[storedMode as keyof typeof Theme];
		}

		return setTheme;
	});


	const [session, setSession] = useState<string>(() => {
		return Cookies.get('session') ?? "";
	});


	useEffect(() => {
		const asyncCheckAuth = async () => {
			console.log("Checking authentication in background");
			let resp = await API.check();
			if (resp.status !== 200) {
				Cookies.delete("session");
				setSession('');
			}
		}

		// This can be improved... A /check request is sent after initial login now. Feels kind of unnecessary
		if (session !== "") {
			asyncCheckAuth();
		}
		
	}, [ session ]);


	const toggleMode = () => {
		let newMode = (mode === Theme.Light) ? Theme.Dark : Theme.Light;
		Cookies.set("mode", newMode);
		setMode(newMode);
	}

	const theme = ( mode === Theme.Dark ) ? 'dark' : 'light';
    const textColor = ( mode === Theme.Dark ) ? 'white-50' : 'dark';

	return (
		<ThemeContext.Provider value={{ mode: mode, toggle: toggleMode }}>
			<AuthContext.Provider value={{ session: session, setSession: (newSess: string) => { setSession(newSess); }, authenticated: session !== '', logout: async () => { await API.logout({ "session": session }); setSession(""); } }}>
				<div className={`allmighty-container allmighty-${theme}`}>
					<Router>
						<div className={`min-vh-100 container-lg bg-${theme} text-${textColor} d-flex flex-column`}>
							<Header />
							<main style={{flexGrow: 1}}>
								{
									session === '' ?
										<Suspense fallback={''}>
											<Login />
										</Suspense>
									:
										<Switch>
											<Route exact path="/users/:userId">
												<Suspense fallback={''}>
													<User />
												</Suspense>
											</Route>

											<Route exact path="/users">
												<Suspense fallback={''}>
													<UserList />
												</Suspense>
											</Route>
											
											<Route exact path="/">
												<p>
													Hej
												</p>
											</Route>
											
											<Route path="/">
												<Suspense fallback={''}>
													<FourOhFour />
												</Suspense>
											</Route>
										</Switch>
									}
							</main>
							<Footer />
						</div>
					</Router>
				</div>
			</AuthContext.Provider>
		</ThemeContext.Provider>
	);
}

export default App;
