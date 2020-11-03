import React from 'react';

// Routing
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect,
	// Link
} from "react-router-dom";

import './App.css';

// Components
import TopBar from '../TopBar/TopBar';
import SignInPage from '../SignInPage/SignInPage';
import SignUpPage from '../SignUpPage/SignUpPage';
import ControlPage from '../ControlPage/ControlPage';

function App() {
	return (
		<Router>
			<div className='App'>
				<TopBar />

				{/* The main component of the page gets swapped here */}
				<Switch>
					<Route path='/signin'>
						<SignInPage />
					</Route>
					<Route path='/signup'>
						<SignUpPage />
					</Route>
					<Route path='/manage'>
						<Redirect to='/control' />
					</Route>
					<Route path='/control'>
						<ControlPage />
					</Route>
					<Route path='/'>
						<Redirect to='/signin' />
					</Route>
				</Switch>
			</div>
		</Router>
	);
}

export default App;
