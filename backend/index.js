const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const path = require('path');
const { v4: uuid } = require('uuid');
const session = require('express-session')
const FileStore = require('session-file-store')(session);
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt-nodejs');
const { Client } = require('pg');
const Crypto = require('crypto')

const PORT = process.env.PORT || 3001;

// Set up the database
const database = new Client({
	connectionString: process.env.DATABASE_URL,
	ssl: {
		rejectUnauthorized: false
	}
});
database.connect();

// Set up passport.js with the local strategy
passport.use(new LocalStrategy(
	(username, password, done) => {

		// Look up the user in the database
		var query = 'SELECT * FROM users WHERE username = $1;';
		var values = [username];

		database.query(query, values, (err, dbres) => {

			// Something went wrong
			if (err) {
				console.log(err.stack);
				return done(null, false, { message: 'Server Error\n' });

				// Check if the user can sign in
			} else {

				// Username is incorrect
				if (dbres.rows.length === 0) {
					return done(null, false, { message: '"Username or password is incorrect"' });
				}

				// Everything looks good
				user = dbres.rows[0];
				if (username === user.username && bcrypt.compareSync(password, user.password)) {
					return done(null, user);

					// Password is incorrect
				} else {
					return done(null, false, { message: '"Username or password is incorrect"' });
				}
			}
		});
	}
));

// Serialize and deserialize the user
passport.serializeUser((user, done) => {
	done(null, user.username);
});
passport.deserializeUser((username, done) => {
	const user = { username: username };
	done(null, user);
});

const app = express();
const httpServer = http.createServer(app);

// Configure middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
	genid: (req) => {
		return uuid() // use UUIDs for session IDs
	},
	store: new FileStore(),
	secret: process.env.SESSIONSECRET,
	resave: false,
	saveUninitialized: true,
	retries: 0,
}));
app.use(passport.initialize());
app.use(passport.session());


// Serve endpoints

// Create a new account
app.post('/api/signup', (req, res, next) => {

	// Check if the username exists

	// Build the query
	var query = 'SELECT EXISTS (SELECT TRUE FROM users where username=$1);';
	var values = [req.body.username];

	database.query(query, values, (err, dbres) => {

		// Username taken
		if (dbres.rows[0].exists) {
			res.status(409).send('"Username taken"');
		}

		// Username available
		else {

			// Generate a password hash
			bcrypt.genSalt(10, function (err, salt) {
				bcrypt.hash(req.body.password, salt, null, function (err, hash) {

					// Insert the user into the database
					var query = "INSERT INTO users (username, password) VALUES ($1, $2);";
					var values = [req.body.username, hash];
					database.query(query, values, (err, dbres) => {
						res.status(201).send('"Account created"');
					});
				});
			});
		}
	});

});

// Attempt to authenticate the user
app.post('/api/signin', (req, res, next) => {
	passport.authenticate('local', (err, user, info) => {
		if (info) {
			return res.status(401).send(info.message);
		}
		if (err) {
			return next(err);
		}
		req.login(user, (err) => {
			if (user) {
				return res.status(200).send('"You have signed in"');
			} else {
				return res.status(401).send('"Incorrect username or password"');
			}
		})
	})(req, res, next);
});

// Sign out the user
app.post('/api/signout', (req, res) => {
	req.logOut();
	res.send('"Signed out"');
});

// Determine if the user is authenticated
app.get('/api/signedin', (req, res) => {

	// Yes
	if (req.isAuthenticated()) {
		res.status(200).send(req.user.username);
	}

	// No
	else {
		res.status(401).send('"your unauthorized"');
	}
});

// Create a new channel
app.post('/api/createchannel', (req, res) => {

	// Check if the user is authenticated
	if (req.isAuthenticated()) {
		// Insert the channel into the database
		const query = "INSERT INTO channels (channel, name, channel_owner) VALUES ($1, $2, $3);";
		const values = [
			Crypto.randomBytes(16).toString('hex'),
			req.body.name,
			req.user.username,
		];
		console.log('New Channel:');
		console.log(values);
		database.query(query, values, (err, dbres) => {
			res.status(201).send('"Channel created"');
		});
	}

	// Unauthenticated
	else {
		res.status(401).send();
	}
});

// Request a list of the user's channels
app.get('/api/getlist', (req, res) => {

	// Check if the user is authenticated
	if (req.isAuthenticated()) {

		// Ask the database for our channels
		const query = 'SELECT channel, name FROM channels WHERE channel_owner = $1;';
		const values = [req.user.username];
		database.query(query, values, (err, dbres) => {
			res.send(dbres.rows);
		});
	}

	// Unauthenticated
	else {
		res.status(401).send([]);
	}
});

// Delete a channel
app.delete('/api/deletechannel', (req, res) => {
	// Check if the user is authenticated
	if (req.isAuthenticated()) {

		// Delete from the database
		const query = 'DELETE FROM channels WHERE channel = $1 AND channel_owner = $2;';
		const values = [req.body.channel, req.user.username];
		database.query(query, values, (err, dbres) => {
			res.status(204).send();
		});
	}

	// Unauthenticated
	else {
		res.status(401).send([]);
	}
});

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
				ws.close(1003, 'Invalid channel format');
				return;
			}

			// Check if the channel is in the database
			const query = 'SELECT EXISTS (SELECT TRUE FROM channels where channel=$1);';
			const values = [ws.channelName];
			database.query(query, values, (err, dbres) => {

				// The channel exists
				if (dbres.rows[0].exists) {
					// Add a new channel to the dictionary
					if (channels[ws.channelName] == undefined) {
						console.log('Channel is unused');
						channels[ws.channelName] = [];
					}

					// Channel is already in use
					else {
						console.log('Channel in use, connecting');
					}

					// Subscribe to the channel
					channels[ws.channelName].push(ws);
					ws.channel = channels[ws.channelName];
					console.log('Subscribed to channel:', ws.channelName);

				}

				// Disconnect the client for making up a channel
				else {
					console.log('Fake channel:', ws.channelName);
					ws.close(1008, 'Haha, you tried connecting to a fake channel');
					return;
				}

			});

		}

		// Send the message to all other channel members
		else {
			for (var i = 0; i < ws.channel.length; i++) {
				if (ws.channel[i] != ws) {
					ws.channel[i].send(message);
				}
			}
		}
	});

	// Log disconnect
	ws.on('close', () => {
		console.log('WebSocket disconnect')

		// Check if the channel was ever valid
		if (!ws.channel) {
			return;
		}

		// Remove the connection from the channel
		for (var i = ws.channel.length; i >= 0; i--) {
			if (ws.channel[i] == ws) {
				ws.channel.splice(i, 1);
			}
		}

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

