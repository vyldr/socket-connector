import React from 'react';
import './TopBar.css';

function TopBar() {
	return (
		<div className='TopBar'>
			<div className='space' />
			<code className='title'>
				Socket Hub
			</code>
			<div className='buttonContainer'>
				<button>Control</button>
				<button>Sign In</button>
			</div>
		</div>
	);
}

export default TopBar;