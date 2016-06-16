const db = require('../db');
const log = require('../log');

const iterateTree = require('../logic/iteratre-tree');
const getDeps = require('../logic/get-dependencies');

module.exports = { tree, deps, exceptions };

function tree(req, res, next){

	res.locals.packageName = req.params.name;

	log.debug(`Routes: Retrieving tree of ${res.locals.packageName}`);

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

	log.debug(`Routes: Retrieving dependencies of ${res.locals.packageName}`);

	getDeps(res.locals.packageName)
		.then(respond)
		.catch(next);

	function respond(result){
		if (!result.length) return next({ noDependencies: true });

		res.json(result);
	}

}

function exceptions(err, req, res, next){

	if ('noDependencies' in err) return res.send(`Package "${res.locals.packageName}" has no dependencies.`);

	if ('statusCode' in err && err.statusCode === 404){
		return res.status(404).send(`Package "${res.locals.packageName}" was not found.`);
	}

	log.error(err);
	res.status(500).end();
}