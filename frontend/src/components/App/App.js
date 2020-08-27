import React from 'react';
import './App.css';

import TopBar from '../TopBar/TopBar';
import SignInPage from '../SignInPage/SignInPage';
import ControlPage from '../ControlPage/ControlPage';

function App() {
	return (
		<div className="App">
			<TopBar />
			{/* <SignInPage /> */}
			<ControlPage />
		</div>
	);
}

export default App;
