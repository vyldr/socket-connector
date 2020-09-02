import React from 'react';
import '../../style.css';
// import './ControlPage.css';

class ControlPage extends React.Component {
	render() {
		return (
			<div className='page'>
				<div className='centerForm'>
					<div className='formTitle'>
						<code>Send a message</code>
					</div>
					<input placeholder='Message'></input><br />
					<button className='formButton'>Send</button>

				</div>
			</div>
		);
	}
}

export default ControlPage;