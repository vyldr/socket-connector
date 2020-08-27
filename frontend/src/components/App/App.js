import React from 'react';

// Routing
import {
	BrowserRouter as Router,
	Switch,
	Route,
	// Link
} from "react-router-dom";

import './App.css';

// Components
import TopBar from '../TopBar/TopBar';
import SignInPage from '../SignInPage/SignInPage';
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
					<Route path='/control'>
						<ControlPage />
					</Route>
				</Switch>
			</div>
		</Router>
	);
}

export default App;
