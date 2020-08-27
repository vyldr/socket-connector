import React from 'react';
import './ControlPage.css';

class ControlPage extends React.Component {
	render() {
		return (
			<div className='ControlPage'>
				<div className='ControlForm'>
					<div className='formTitle'>
						<code>Send a message</code>
					</div>
					<input placeholder='Message'></input><br />
					<button className='MessageButton'>Send</button>

				</div>
			</div>
		);
	}
}

export default ControlPage;