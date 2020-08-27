import React from 'react';
import {
	Link
} from 'react-router-dom';

import './TopBar.css';

function TopBar() {
	return (
		<div className='TopBar'>
			<div className='space' />
			<code className='title'>
				Socket Hub
			</code>
			<div className='buttonContainer'>
				<Link to='/control'>
					<button className='TopBarButton'>Control</button>
				</Link>
				<Link to='/signin'>
					<button className='TopBarButton'>Sign In</button>
				</Link>
			</div>
		</div>
	);
}

export default TopBar;