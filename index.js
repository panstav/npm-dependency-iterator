const express = require('express');

const cache = require('./dependencies-cache');
const depIterator = require('./dependency-tree-iterator');
const getDepsOfPackage = require('./get-deps-of-package');

const server = express();
const port = 3000;

server.get('/cache', (req, res) => {

	cache.list()
		.then(data => data ? res.json(data) : res.send('Cache is empty.'));

});

server.get('/deps/:name', (req, res, next) => {
	res.locals.packageName = req.params.name;

	getDepsOfPackage(res.locals.packageName)
		.then(result => result.length ? res.json(result) : res.send(`Package "${res.locals.packageName}" has no dependencies.`))
		.catch(next);

});

server.get('/tree/:name', (req, res, next) => {
	res.locals.packageName = req.params.name;

	getDepsOfPackage(res.locals.packageName)
		.then(depIterator)
		.then(result => result.length ? res.json(result) : res.send(`Package "${res.locals.packageName}" has no dependencies.`))
		.catch(next);

});

server.use((err, req, res, next) => {
	if ('statusCode' in err && err.statusCode === 404) return res.send(`Package "${res.locals.packageName}" was not found.`);

	console.error(err);
	res.status(500).end();
});

server.listen(port, err => {
	if (err) return console.error(err);
	console.log(`Server listening on port ${port}`);
});