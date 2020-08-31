const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function (app) {

	// WebSocket proxy
	app.use(
		createProxyMiddleware(
			'/ws',
			{
				target: 'http://localhost:3001',
				ws: true
			})
	);

	// General requests
	app.use(
		createProxyMiddleware(
			'/api',
			{
				target: 'http://localhost:3001',
			})
	);
};
