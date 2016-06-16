const express = require('express');

const routes = require('./routes');

module.exports = initServer;

function initServer(){

	const server = express();

	server.get('/cache', routes.cache);
	server.get('/deps/:name', routes.deps);
	server.get('/tree/:name', routes.tree);

	server.use(routes.exceptions);

	return server;
}