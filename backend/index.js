const express = require('express')
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

// Start the server
httpServer.listen(PORT, () => {
	console.log('Server listening on: ' + PORT);
});

