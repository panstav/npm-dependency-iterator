const got = require('got');

const db = require('../db');
const log = require('../log');

module.exports = getDeps;

module.exports._ = {
	queryNpmForDeps,
	resolveVersion,
	isStrictSemver
};

function getDeps(packageName, version){

	return resolveVersion(packageName, version)

		.then(resolvedVersion => {
			version = resolvedVersion;
			return db.get(packageName, resolvedVersion);
		})

		.then(data => {

			// if cache has the data, use it
			if (data) return data;

			log.debug(`GetDeps: No cache of ${packageName}@${version}, querying npm.`);

			// if no data was found on cache, fetch it from registry, and save it
			return queryNpmForDeps(packageName, version)
				.then(npmData => db.set(packageName, version, npmData));

		});

}

function queryNpmForDeps(packageName, version){

	return got(`https://registry.npmjs.org/${packageName}/${version}?json=true`, { json: true }).then(resp => {

		const dependencies = resp.body.dependencies;

		if (!dependencies) return [];

		// otherwise parse dependencies object into an array and return it
		return Object.keys(dependencies).map(key => { return { name: key, version: dependencies[key] } });

	});

}

function resolveVersion(packageName, version){

	log.debug(`GetDeps: Resolving version of ${packageName}@${version}`);

	if (version && isStrictSemver(version)) return Promise.resolve(version);

	log.debug(`GetDeps: Querying npm to resolve exact version of ${packageName}`);

	// if no version was given, query npm for latest
	return got(`https://registry.npmjs.org/${packageName}/${version || 'latest'}?json=true`, { json: true }).then(resp => resp.body.version);

}

function isStrictSemver(version){
	return /^[0-9]+\.[0-9]+\.[0-9]+$/.test(version);
}