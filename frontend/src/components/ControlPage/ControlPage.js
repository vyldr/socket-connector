import React from 'react';
import '../../style.css';
// import './ControlPage.css';

class ControlPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			message: '',
		};

		this.handleChange = this.handleChange.bind(this);
		this.sendMessage = this.sendMessage.bind(this);
	}

	componentDidMount() {
		// Open our WebSocket connection
		if (document.location.protocol === 'http:') {
			this.ws = new WebSocket('ws://' + document.location.host + '/ws',);
		} else {
			this.ws = new WebSocket('wss://' + document.location.host + '/ws',);
		}


		// The connection is open
		this.ws.onopen = () => {
			console.log('connected');
		};

		// Received a message from the sercer
		this.ws.onmessage = (event) => {
			var message = JSON.parse(event.data);
			console.log('From Server:', message);
		};
	}

	// Clean up the WebSocket
	componentWillUnmount() {
		console.log('disconnected');
		this.ws.close();
	}

	// Send a message to the server
	sendMessage() {
		this.ws.send(this.state.message);
		console.log('To Server:  ', this.state.message);
		this.setState({ message: '' });
	}

	// Update the message box text
	handleChange(event) {
		this.setState({ message: event.target.value });
	}

	render() {
		return (
			<div className='page'>
				<div className='centerForm'>
					<div className='formTitle'>
						<code>Send a message</code>
					</div>

					{/* Message box */}
					<input placeholder='Message'
						value={this.state.message}
						onChange={this.handleChange}>
					</input><br />

					{/* Send button */}
					<button className='formButton'
						onClick={this.sendMessage}>
						Send
					</button>

				</div>
			</div>
		);
	}
}

export default ControlPage;