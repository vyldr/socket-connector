import React from 'react';

// Routing
import {
	BrowserRouter as Router,
	Switch,
	Route,
} from "react-router-dom";

import './App.css';

// Components
import TopBar from '../TopBar/TopBar';
import SignInPage from '../SignInPage/SignInPage';
import SignUpPage from '../SignUpPage/SignUpPage';
import ManagePage from '../ManagePage/ManagePage';
import ControlPage from '../ControlPage/ControlPage';
import InfoPage from '../InfoPage/InfoPage';

function App() {
	return (
		<Router>
			<div className='App'>
				<TopBar />

				{/* The main component of the page gets swapped here */}
				<Switch>
					<Route path='/signin' component={SignInPage} />
					<Route path='/signup' component={SignUpPage} />
					<Route path='/manage' component={ManagePage} />
					<Route path='/control' component={ControlPage} />
					<Route path='/' component={InfoPage} />
				</Switch>
			</div>
		</Router>
	);
}

export default App;
