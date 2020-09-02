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

// WebSocket connect
wss.on('connection', (ws) => {

	// Received a message
	ws.on('message', (message) => {
		console.log('received:', message);

		// Thank the client for its message
		var response = 'Thank you for ' + message;
		ws.send(JSON.stringify(response));
		console.log('Sent:     ' + response);
	});

	// Log disconnect
	ws.on('close', () => {
		console.log('WebSocket disconnect')
	});

	// Log connection
	ws.send(JSON.stringify('Connected'));
	console.log('WebSocket connect');
});


// Start the server
httpServer.listen(PORT, () => {
	console.log('Server listening on: ' + PORT);
});

