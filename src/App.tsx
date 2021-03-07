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

	const toggleMode = () => {
		let newMode = (mode === Theme.Light) ? Theme.Dark : Theme.Light;
		Cookies.set("mode", newMode);
		setMode(newMode);
	}
 
	const theme = ( mode === Theme.Dark ) ? 'dark' : 'light';
    const themeInverse = ( mode === Theme.Dark ) ? 'light' : 'dark';

	return (
		<ThemeContext.Provider value={{ mode: mode, toggle: toggleMode }}>
			<Router>
				<div className={`container bg-${theme} text-${themeInverse}`}>
					<Header />
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
							<main>
								<h2>Hellooo</h2>
									<p>
										<Link to="/users" className="link-info" >Users</Link>
									</p>
							</main>
						</Route>
						
						<Route path="/">
							<Suspense fallback={''}>
								<FourOhFour />
							</Suspense>
						</Route>

					</Switch>

					<Footer />
				</div>
			</Router>

		</ThemeContext.Provider>
	);
}

export default App;
