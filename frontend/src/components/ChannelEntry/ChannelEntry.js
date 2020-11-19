import React from 'react';
import { Redirect } from 'react-router-dom/cjs/react-router-dom.min';
import '../../style.css';

import './ChannelEntry.css';

class ChannelEntry extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			channel: props.channel,
			channelName: props.channelName,
			deleted: false,
			redirect: false,
		};

		// Bind functions
		this.control = this.control.bind(this);
		this.copyKey = this.copyKey.bind(this);
		this.deleteChannel = this.deleteChannel.bind(this);

	}

	// Go to the control page for this channel
	control() {
		this.setState({ redirect: '/control' });
	}

	// Copy the channel key to the clipboard
	copyKey() {
		navigator.clipboard.writeText(this.state.channel);
	}

	// Delete a channel from the server
	deleteChannel() {
		if (window.confirm('Are you sure you want to delete this channel?')) {
			const data = JSON.stringify({ channel: this.state.channel });
			fetch(document.location.origin + '/api/deletechannel', {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				},
				body: data,
			}).then(() => this.setState({ deleted: true }));
		}
	}

	render() {

		// Entry deleted
		if (this.state.deleted) {
			return null
		}

		// Go to the control page
		if (this.state.redirect) {
			return (
				<Redirect to={{
					pathname: this.state.redirect,
					state: {
						channel: this.state.channel,
						channelName: this.state.channelName,
					}
				}} />
			)
		}

		return (
			<div className='ChannelEntry'>
				{/* Channel name */}
				< div className='channelName' >
					{this.state.channelName}
				</div >

				<div className='channelButtons'>

					{/* Control button */}
					<button onClick={this.control}
						title='Connect to this channel to send and receive commands'
						className='manageButton control'>
						Control
					</button>

					{/* Copy button */}
					< button onClick={this.copyKey}
						title='Copy the channel key to the clipboard'
						className='manageButton copy' >
						Copy key
					</button>

					{/* Delete button */}
					< button className='manageButton delete'
						title='Permanently delete this channel'
						onClick={this.deleteChannel}>
						Delete
					</button>
				</div>
			</div >
		);
	}
}

export default ChannelEntry;