import React, { useState, Suspense } from 'react';

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import { ThemeContext, Theme } from './context/ThemeContext';
import Header from './view/Header';
import Footer from './view/Footer';


import Cookies from './helper/Cookies';

const User = React.lazy(() => import("./view/User"));
const UserList = React.lazy(() => import("./view/UserList"));
const FourOhFour = React.lazy(() => import("./view/FourOhFour"));

function App() {

	let storedMode = Cookies.get('mode');
	let defaultMode = Theme.Light;

	if (storedMode !== undefined && Object.keys(Theme).includes(storedMode as Theme)) {
		defaultMode = Theme[storedMode as keyof typeof Theme];
	}

	const [mode, setMode] = useState<Theme>(defaultMode);

	const [session, setSession] = useState<string>("");

	const toggleMode = () => {
		let newMode = (mode === Theme.Light) ? Theme.Dark : Theme.Light;
		Cookies.set("mode", newMode);
		setMode(newMode);
	}

	const login = async () => {
		fetch('http://localhost:5000/api/auth/1/login', { headers: { 'Content-Type': 'application/json' }, credentials: 'include', method: 'POST', body: JSON.stringify({ 'password': 'test' })}).then(resp => resp.json()).then(json => {
			console.log(json);
			setSession(json.data.session);
		});
	}

	const logout = async () => {
		fetch('http://localhost:5000/api/auth/1/logout', { headers: { 'Content-Type': 'application/json' }, credentials: 'include', method: 'POST', body: JSON.stringify({ "session": session })}).then(resp => resp.json()).then(json => {
			console.log(json);
		});
	}

	const theme = ( mode === Theme.Dark ) ? 'dark' : 'light';
    const themeInverse = ( mode === Theme.Dark ) ? 'light' : 'dark';

	return (
		<ThemeContext.Provider value={{ mode: mode, toggle: toggleMode }}>
			<Router>
				<div className={`container bg-${theme} text-${themeInverse}`}>
					<Header />
					<button onClick={login}>Login</button>
					<button onClick={logout}>Logout</button>
					<main>
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
									<Link to="/users" className="link-info" >Users</Link>
								</p>
							</Route>
							
							<Route path="/">
								<Suspense fallback={''}>
									<FourOhFour />
								</Suspense>
							</Route>
						</Switch>
					</main>
					<Footer />
				</div>
			</Router>

		</ThemeContext.Provider>
	);
}

export default App;
