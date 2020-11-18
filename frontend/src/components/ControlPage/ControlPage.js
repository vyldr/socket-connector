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
			messageFocused: false,
			channel: props.location.state ? props.location.state.channel : '',
			channelName: props.location.state ? props.location.state.channelName : '',
			keyboardEnable: true,
			mouseEnable: false,
			controllerEnable: false,
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleInput = this.handleInput.bind(this);
		this.lockChange = this.lockChange.bind(this);
		this.sendMessageBox = this.sendMessageBox.bind(this);
		this.addMessage = this.addMessage.bind(this);
		this.gpConnect = this.gpConnect.bind(this);
		this.gpDisconnect = this.gpDisconnect.bind(this);
		this.gpPoll = this.gpPoll.bind(this);

		// Set up the gamepad model
		this.gamepads = {
			count: 0,
			interval: null,
		};
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
			this.addMessage(message);
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

		// Gamepad connect
		window.addEventListener('gamepadconnected', this.gpConnect);

		// Gamepad disconnect
		window.addEventListener('gamepaddisconnected', this.gpDisconnect);
	}

	// Prepare input events to send
	handleInput(event) {

		// Keypress
		if ((event.type === 'keydown' ||
			event.type === 'keyup') &&
			!event.repeat &&
			this.state.keyboardEnable &&
			!this.state.messageFocused) {

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
		document.getElementById('mouseButton').requestPointerLock();
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

	// A new gamepad was connected
	gpConnect(event) {
		// Add the new gamepad to the tracker
		this.gamepads[event.gamepad.index] = {
			axes: new Array(event.gamepad.axes.length).fill(0),
			buttons: new Array(event.gamepad.buttons.length).fill(0),
		}

		// Start polling
		if (this.gamepads.count++ === 0) {
			this.gamepads.interval = setInterval(this.gpPoll, (1000 / 60));
		}
	}

	// A gamepad was removed
	gpDisconnect(event) {

		// Remove the gamepad from the tracker
		delete this.gamepads[event.gamepad.index];

		// Stop polling
		if (--this.gamepads.count === 0) {
			clearInterval(this.gamepads.interval);
		}
	}

	// Check the current status of the gamepads
	gpPoll() {

		// Cancel if gamepads are disabled
		if (!this.state.controllerEnable) {
			return;
		}

		// Update gamepad state
		var gamepads = navigator.getGamepads();

		// Check each connected gamepad
		for (var i = 0; i < gamepads.length; i++) {
			if (gamepads[i]) {

				// Current and previous values
				var value, previous;

				// Check for new axis values
				for (var axis = 0; axis < gamepads[i].axes.length; axis++) {
					value = gamepads[i].axes[axis];
					previous = this.gamepads[i].axes[axis];
					if (value !== previous) {

						// Update the value
						this.gamepads[i].axes[axis] = value;

						// Send the change
						this.send({
							type: 'axis',
							id: i,
							axis: axis,
							value: value,
						});
					}
				}

				// Check for new button values
				for (var button = 0; button < gamepads[i].buttons.length; button++) {
					value = gamepads[i].buttons[button].value;
					previous = this.gamepads[i].buttons[button];
					if (value !== previous) {

						// Update the value
						this.gamepads[i].buttons[button] = value;

						// Send the change
						this.send({
							type: 'button',
							id: i,
							button: button,
							value: value,
						});
					}
				}
			}
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
		window.removeEventListener('gamepadconnected', this.gpConnect);
		window.removeEventListener('gamepaddisconnected', this.gpConnect);
	}

	// Send a message to the server
	send(message) {
		console.log('Sent:', message);
		message = JSON.stringify(message);
		this.ws.send(message);
		this.addMessage(message);
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

	// Add a message to the message log
	addMessage(message) {

		// Build the code line
		var code = document.createElement('div');
		code.innerText = message;
		code.classList.add('json');
		code.classList.add('code');
		window.hljs.highlightBlock(code);

		// Add the new line
		var messageHistory = document.getElementById('messageHistory');
		messageHistory.insertBefore(code, messageHistory.firstChild);

		// Remove old lines
		if (messageHistory.childNodes.length > 100) {
			messageHistory.removeChild(messageHistory.lastChild);
		}
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
						<code>Send a command</code>
					</div>

					<pre className='messageHistory json'
						id='messageHistory'>
					</pre>

					<form onSubmit={this.sendMessageBox}>

						{/* Message box */}
						<input placeholder={'Message to ' + this.state.channelName}
							id='messageBox'
							autoComplete='off'
							value={this.state.message}
							onChange={this.handleChange}
							onFocus={() => this.setState({ messageFocused: true })}
							onBlur={() => this.setState({ messageFocused: false })}>
						</input>

						{/* Send button */}
						<button className='formButton'
							id='messageButton'
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
						<button className={this.state.keyboardEnable && !this.state.messageFocused ? 'enabled' : ''}
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
						<button className={this.state.controllerEnable ? 'enabled' : ''}
							onClick={() => this.setState({ controllerEnable: !this.state.controllerEnable })}>
							Controller
						</button>
					</div>
				</div>
			</div>
		);
	}
}

export default ControlPage;