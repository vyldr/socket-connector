import React from 'react';
import { Redirect } from 'react-router-dom';
import '../../style.css';
import './ControlPage.css';

class ControlPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			redirect: false,
			message: '',
			channel: props.location.state ? props.location.state.channel : '',
			channelName: props.location.state ? props.location.state.channelName : '',
			keyboardEnable: false,
			mouseEnable: false,
			controllerEnable: false,
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleInput = this.handleInput.bind(this);
		this.lockChange = this.lockChange.bind(this);
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

			// Authenticate
			this.ws.send(this.state.channel);
		};

		// Received a message from the server
		this.ws.onmessage = (event) => {
			var message = event.data;
			console.log('Received:', JSON.parse(message));
		};

		// The connection was closed
		this.ws.onclose = (event) => {
			console.log('Connection closed:', event.code, event.reason);
			this.setState({ redirect: '/manage' });
		}

		// Handle keydowns
		document.addEventListener('keydown', this.handleInput);

		// Handle keyups
		document.addEventListener('keyup', this.handleInput);

		// Pointer lock
		document.addEventListener('pointerlockchange', this.lockChange);

		// Mouse move
		document.addEventListener('mousemove', this.handleInput);

		// Mouse down
		document.addEventListener('mousedown', this.handleInput);

		// Mouse up
		document.addEventListener('mouseup', this.handleInput);

		// Mouse scroll
		document.addEventListener('wheel', this.handleInput);
	}

	// Prepare input events to send
	handleInput(event) {

		// Keypress
		if ((event.type === 'keydown' ||
			event.type === 'keyup') &&
			!event.repeat &&
			this.state.keyboardEnable) {

			this.send({
				type: event.type,
				key: event.code,
			});
		}

		// Mouse move
		if (event.type === 'mousemove' &&
			this.state.mouseEnable) {
			this.send({
				type: event.type,
				x: event.movementX,
				y: event.movementY,
			});
		}

		// Mouse click
		if ((event.type === 'mousedown' ||
			event.type === 'mouseup') &&
			this.state.mouseEnable) {
			this.send({
				type: event.type,
				button: event.button,
			});
		}

		// Mouse wheel
		if (event.type === 'wheel' &&
			this.state.mouseEnable) {
			this.send({
				type: event.type,
				x: event.deltaX,
				y: event.deltaY,
			});
		}
	}

	// Capture the pointer
	mouseStart() {
		document.requestPointerLock();
	}

	// Check if the pointer is captured
	lockChange() {

		// Captured
		if (document.pointerLockElement) {
			this.setState({ mouseEnable: true });

			// Unfocus the button to avoid accidentally selecting it
			document.getElementById('mouseButton').blur();
		}

		// Released
		else {
			this.setState({ mouseEnable: false });
		}
	}

	componentWillUnmount() {

		// Close the WebSocket connection
		console.log('Disconnecting...');
		this.ws.close();

		// Remove event listeners
		document.removeEventListener('keydown', this.handleInput);
		document.removeEventListener('keyup', this.handleInput);
		document.removeEventListener('pointerlockchange', this.lockChange);
		document.removeEventListener('mousemove', this.handleInput);
		document.removeEventListener('mousedown', this.handleInput);
		document.removeEventListener('mouseup', this.handleInput);
		document.removeEventListener('wheel', this.handleInput);
	}

	// Send a message to the server
	send(message) {
		this.ws.send(JSON.stringify(message));
		console.log('Sent:    ', message);
	}

	// Send the contents of the message box
	sendMessageBox(event) {
		// Prevent the standard form submit
		event.preventDefault();

		this.send({
			type: 'message',
			input: this.state.message,
		});
		this.setState({ message: '' });
	}

	// Update the message box text
	handleChange(event) {
		this.setState({ message: event.target.value });
	}

	render() {
		if (this.state.redirect) {
			return (<Redirect to={this.state.redirect} />);
		}

		return (
			<div className='page ControlPage'>
				<div className='centerForm'>

					{/* Title */}
					<div className='formTitle'>
						<code>Send a message</code>
					</div>

					<form onSubmit={this.sendMessageBox}>

						{/* Message box */}
						<input placeholder={'Message to ' + this.state.channelName}
							value={this.state.message}
							onChange={this.handleChange}>
						</input>

						{/* Send button */}
						<button className='formButton'
							type='submit'>
							Send
						</button>
					</form>

					<hr />

					{/* Input settings */}
					<div className='formTitle'>
						<code>Input settings</code>
					</div>

					<div className='buttonContainer'>

						{/* Keyboard button */}
						<button className={this.state.keyboardEnable ? 'enabled' : ''}
							onClick={() => this.setState({ keyboardEnable: !this.state.keyboardEnable })}>
							Keyboard
						</button>

						{/* Mouse button */}
						<button className={this.state.mouseEnable ? 'enabled' : ''}
							onClick={this.mouseStart}
							id='mouseButton'>
							Mouse
						</button>

						{/* Controller button */}
						<button>
							Controller
						</button>
					</div>
				</div>
			</div>
		);
	}
}

export default ControlPage;