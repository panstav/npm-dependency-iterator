const express = require('express');

const routes = require('./routes');

module.exports = initServer;

function initServer(){

	const server = express();

	// prettify response json
	server.set('json spaces', 4);

	server.get('/tree/:name', routes.tree);

	server.get('/', (req, res) => res.sendFile('index.html', { root: 'public' }));

	server.use(
		express.static('public'),
		routes.exceptions,
		routes.fourofour
	);

	return server;
}