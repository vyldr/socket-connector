import React from 'react';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import '../../style.css';

import './ChannelEntry.css';

class ChannelEntry extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			channel: props.channel,
			channelName: props.channelName,
			deleted: false,
		};

		// Bind functions
		this.copyKey = this.copyKey.bind(this);
		this.deleteChannel = this.deleteChannel.bind(this);

	}

	// Copy the channel key to the clipboard
	copyKey() {
		navigator.clipboard.writeText(this.state.channel);
	}

	// Delete a channel from the server
	deleteChannel() {
		const data = JSON.stringify({ channel: this.state.channel });
		fetch(document.location.origin + '/api/deletechannel', {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			},
			body: data,
		}).then(() => this.setState({ deleted: true }));
	}

	render() {
		if (this.state.deleted) {
			return null
		}

		return (
			<div>
				{/* Channel name */}
				< div className='channelName' >
					{this.state.channelName}
				</div >

				{/* Control button */}
				< Link to={{
					pathname: '/control',
					state: this.state.channel,
				}}>
					<button className='manageButton control'>
						Control
					</button>
				</Link >

				{/* Copy button */}
				< button onClick={this.copyKey}
					className='manageButton copy' >
					Copy key
			</button >

				{/* Delete button */}
				< button className='manageButton delete'
					onClick={this.deleteChannel}>
					Delete channel
				</button >
				<hr />
			</div >
		);
	}
}

export default ChannelEntry;