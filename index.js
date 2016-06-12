const express = require('express');

const getDepsOfPackage = require('./get-deps-of-package');

const server = express();
const port = 3000;

server.get('/deps/:name', (req, res) => {

	const packageName = req.params.name;

	getDepsOfPackage(packageName)
		.then(result => result.length ? res.json(result) : res.send(`Package "${packageName}" has no dependencies.`))
		.catch(err => { console.error(err); res.status(500).end(); });

});

server.listen(port, err => {
	if (err) return console.error(err);
	console.log(`Server listening on port ${port}`);
});