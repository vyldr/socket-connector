const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const path = require('path');

const PORT = process.env.PORT || 3001;

const app = express();
const httpServer = http.createServer(app);

// Serve endpoints
app.get('/api/date', (req, res) => {
	res.send(JSON.stringify((new Date()).getTime()));
	console.log('/api/date');
});

// Serve static files from a directory
app.use(express.static('./public'));

// Send anything else to index.html
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname + '/public/index.html'));
});


//
// WebSocket
//

// Serve WebSocket
const wss = new WebSocket.Server({
	server: httpServer,
	path: '/ws',
});

// Dictionary of channels
var channels = {};

// WebSocket connect
wss.on('connection', (ws) => {

	ws.channelName = null;

	// Received a message
	ws.on('message', (message) => {

		// Join a channel
		if (ws.channelName == null) {
			ws.channelName = message;

			console.log('Channel request:', ws.channelName);

			// Make sure channel is a string
			if (typeof (ws.channelName) != 'string') {
				console.log('Channel request denied:', ws.channelName);
				ws.close(1008, 'Invalid channel format');
				return;
			}

			// Add a new channel to the dictionary
			if (channels[ws.channelName] == undefined) {
				console.log('Channel is undefined');
				channels[ws.channelName] = [];
			} else {
				console.log('Channel exists, connecting');
			}

			// Subscribe to the channel
			channels[ws.channelName].push(ws);
			ws.channel = channels[ws.channelName];
			console.log('Subscribed to channel:', ws.channelName);


		// Send the message to all other channel members
		} else {
			for (var i = 0; i < ws.channel.length; i++) {
				if (ws.channel[i] != ws) {
					ws.channel[i].send(message);
				}
			}
		}
	});

	// Log disconnect
	ws.on('close', () => {

		// Remove the connection from the channel
		for (var i = ws.channel.length; i >= 0; i--) {
			if (ws.channel[i] == ws) {
				ws.channel.splice(i, 1);
			}
		}
		console.log('WebSocket disconnect')

		// Remove empty channel
		if (ws.channel.length === 0) {
			delete channels[ws.channelName];
			console.log('Remove channel:', ws.channelName);
		}
	});

	// Log connection
	ws.send('Connected');
	console.log('WebSocket connect');
});


// Start the server
httpServer.listen(PORT, () => {
	console.log('Server listening on: ' + PORT);
});

