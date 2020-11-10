import React from 'react';
import { withRouter } from 'react-router-dom/cjs/react-router-dom.min';
import '../../style.css';

// import './ManagePage.css';

import ChannelEntry from '../ChannelEntry/ChannelEntry';

class ManagePage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			channels: [],
			newChannelName: '',
		};

		// Input handlers
		this.handleChange = this.handleChange.bind(this);
		this.newChannel = this.newChannel.bind(this);

	}

	// Input fields
	handleChange(event) {
		this.setState({ [event.target.name]: event.target.value });
	}

	componentDidMount() {
		this.getList();
	}

	// Get the list of channels
	getList() {
		fetch(document.location.origin + '/api/getlist')
			.then(res => res.json().then(data => ({
				status: res.status,
				channels: data
			})))
			.then(obj => {

				// Update the channel list
				if (obj.status === 200) {
					this.setState({
						channels: obj.channels,
					});
				}

				// Redirect to sign in if necessary
				else {
					this.props.history.push('/signin');
				}
			});
	}

	// Create a new channel
	newChannel(event) {
		// Prevent the standard form submit
		event.preventDefault();

		// Request a new channel
		const data = JSON.stringify({
			name: this.state.newChannelName,
		});
		fetch(document.location.origin + '/api/createchannel', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: data,
		})
			.then((res) => {

				// Redirect to the sign in page if signed out
				if (res.status === 401) {
					this.props.history.push('/signin');
				}

				// Update the channel list
				else {
					this.getList();
				}

			});
	}

	render() {
		return (
			<div className='page'>
				<div className='centerForm'>

					{/* Title */}
					<div className='formTitle'>
						<code>Manage Channels</code>
					</div>

					{/* Create an entry for each channel */}
					<div className='List'>
						{this.state.channels.map(channel => (
							<ChannelEntry
								key={channel.channel}
								channel={channel.channel}
								channelName={channel.name}
							/>
						))}
					</div>

					{/* Create new channel */}
					<hr />
					<form onSubmit={this.newChannel}>
						<input name='newChannelName'
							required
							placeholder='New channel name'
							autoComplete='off'
							value={this.state.newChannelName}
							onChange={this.handleChange} />

						<button className='formButton'
							type='submit'>
							New channel
						</button>
					</form>
				</div>
			</div >

		)
	}
}

export default withRouter(ManagePage);