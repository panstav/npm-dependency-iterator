const got = require('got');

const db = require('../db');
const log = require('../log');

module.exports = getDeps;

// expose helper function for testing
module.exports._ = {
	queryNpmForDeps,
	resolveVersion,
	isStrictSemver
};

function getDeps(packageName, version){

	return resolveVersion(packageName, version)
		.then(checkCacheForDeps)
		.then(useCachedOrQueryNpm);

	function checkCacheForDeps(resolvedVersion){
		// update used version so to not deal with "{^,~}x.y.z" semvers
		version = resolvedVersion;
		return db.get(packageName, resolvedVersion);
	}

	function useCachedOrQueryNpm(data){

		// if cache has the data, use it
		if (data) return data;

		log.debug(`GetDeps: No cache of ${packageName}@${version}, querying npm.`);

		// otherwise, fetch it from the npm registry, and save it before returning data
		return queryNpmForDeps(packageName, version)
			.then(npmData => db.set(packageName, version, npmData));
	}

}

function queryNpmForDeps(packageName, version){

	return got(`https://registry.npmjs.org/${packageName}/${version}?json=true`, { json: true }).then(resp => {

		const dependencies = resp.body.dependencies;

		// if there are no dependencies for this package - return an empty string for use with Array methods
		if (!dependencies) return [];

		// otherwise parse dependencies object into an array of { name, version } and return it
		return Object.keys(dependencies).map(key => { return { name: key, version: dependencies[key] } });
	});

}

function resolveVersion(packageName, version){

	log.debug(`GetDeps: Resolving version of ${packageName}@${version}`);

	// if a specific version was provided, use it only if it's strict
	if (version && isStrictSemver(version)) return Promise.resolve(version);

	log.debug(`GetDeps: Querying npm to resolve exact version of ${packageName}`);

	// otherwise, query npm for non-strict version or 'latest' if not versionString was provided at all
	return got(`https://registry.npmjs.org/${packageName}/${version || 'latest'}?json=true`, { json: true })
		.then(resp => resp.body.version);

}

// https://github.com/bahmutov/to-exact-semver/blob/master/src/is-strict-semver.js
function isStrictSemver(version){
	return /^[0-9]+\.[0-9]+\.[0-9]+$/.test(version);
}