const express = require('express');

const routes = require('./routes');

module.exports = initServer;

function initServer(){

	const server = express();

	// prettify response json
	server.set('json spaces', 4);

	server.get('/cache', routes.cache);
	server.get('/deps/:name', routes.deps);
	server.get('/tree/:name', routes.tree);

	server.use(routes.exceptions);

	return server;
}