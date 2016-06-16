const got = require('got');

const db = require('../db');

module.exports = getDeps;

function getDeps(packageName, version){
	version = version || 'latest';

	return db.get(packageName, version).then(data => {

		// if cache has the data, use it
		if (data) return data;

		// if no data was found on cache, fetch it from registry, and save it
		return queryNpm(packageName, version)
			.then(data => db.set(packageName, version, data));

	});

}

function queryNpm(packageName, version){

	return got(`https://registry.npmjs.org/${packageName}/${version}?json=true`, { json: true }).then(resp => {

		// if package has no dependencies - return an empty array
		if (!resp.body.dependencies) return [];

		// otherwise parse dependencies object into an array and return it
		return Object.keys(resp.body.dependencies).map(key => { return { name: key, version: resp.body.dependencies[key] } });

	});

}