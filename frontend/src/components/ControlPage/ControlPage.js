import React from 'react';
import '../../style.css';
// import './ControlPage.css';

class ControlPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			message: '',
			channel: 'example-channel-1234',
		};

		this.handleChange = this.handleChange.bind(this);
		this.sendMessageBox = this.sendMessageBox.bind(this);
	}

	componentDidMount() {
		// Set the correct protocol
		var protocol = 'wss://';
		if (document.location.protocol === 'http:') {
			protocol = 'ws://';
		}

		// Open our WebSocket connection
		this.ws = new WebSocket(protocol + document.location.host + '/ws');

		// The connection is open
		this.ws.onopen = () => {
			console.log('connected');

			// Authenticate
			this.send(this.state.channel);
		};

		// Received a message from the sercer
		this.ws.onmessage = (event) => {
			var message = event.data;
			console.log('From Server:', message);
		};
	}

	// Clean up the WebSocket
	componentWillUnmount() {
		console.log('disconnected');
		this.ws.close();
	}

	// Send a message to the server
	send(message) {
		this.ws.send(message);
		console.log('To Server:  ', message);
	}

	// Send the contents of the message box
	sendMessageBox() {
		this.send(this.state.message);
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
					</input>

					{/* Send button */}
					<button className='formButton'
						onClick={this.sendMessageBox}>
						Send
					</button>

				</div>
			</div>
		);
	}
}

export default ControlPage;