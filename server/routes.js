const db = require('../db');

const iterateTree = require('../logic/iteratre-tree');
const getDeps = require('../logic/get-dependencies');

module.exports = { tree, deps, cache, exceptions };

function tree(req, res, next){

	res.locals.packageName = req.params.name;

	getDeps(res.locals.packageName)
		.then(iterateTree)
		.then(respond)
		.catch(next);

	function respond(result){
		if (!result.length) return next({ noDependencies: true });

		res.json(result);
	}

}

function deps(req, res, next){

	res.locals.packageName = req.params.name;

	getDeps(res.locals.packageName)
		.then(respond)
		.catch(next);

	function respond(result){
		if (!result.length) return next({ noDependencies: true });

		res.json(result);
	}

}

function cache(req, res, next){

	db.list()
		.then(respond)
		.catch(next);

	function respond(result){
		if (!result) return res.send('Cache is empty.');

		res.json(result);
	}

}

function exceptions(err, req, res, next){

	if ('noDependencies' in err) return res.send(`Package "${res.locals.packageName}" has no dependencies.`);

	if ('statusCode' in err && err.statusCode === 404){
		return res.send(`Package "${res.locals.packageName}" was not found.`);
	}

	console.error(err);
	res.status(500).end();
}