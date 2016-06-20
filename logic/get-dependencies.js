const got = require('got');
const semver = require('semver');
const clone = require('lodash.clonedeep');

const db = require('../db');
const log = require('../log');
const scheduler = require('../scheduler');

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
		return db.dependencies.get(packageName, resolvedVersion);
	}

	function useCachedOrQueryNpm(data){

		// if cache has the data, use it
		if (data) return data;

		log.debug(`GetDeps: No cache of ${packageName}@${version}, querying npm.`);

		// otherwise, fetch it from the npm registry, schedule saving it for after current request
		return queryNpmForDeps(packageName, version).then(npmData => {
			scheduler.add(db.dependencies.set.bind(null, packageName, version, clone(npmData)));
			return npmData;

			// return db.dependencies.set(packageName, version, clone(npmData));
			// this is another strategy which is better for huge packages
			// when a certain version of a package can be a dependency of tens and hundreds of packages in it
			// and it is worth the wait for a save after each package resolution
		});
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

	// if no version was provided go on and query npm for latest
	if (!version) return queryNpmForVersion();

	// otherwise use it as-is if it's strict
	if (isStrictSemver(version)) return Promise.resolve(version);

	// but if it's a non-strict version check if db has a version that satisfies it
	return db.versions.get(packageName).then(savedVersions => {
		if (!savedVersions || !savedVersions.length) return queryNpmForVersion();
		const satisfactory = savedVersions.filter(savedVersion => semver.satisfies(savedVersion, version));

		// saved version won't satisfy, query npm for exact version
		return satisfactory.length ? satisfactory[0] : queryNpmForVersion();
	});

	function queryNpmForVersion(){
		log.debug(`GetDeps: Querying npm to resolve exact version of ${packageName}`);

		// otherwise, query npm for non-strict version or 'latest' if not versionString was provided at all
		return got(`https://registry.npmjs.org/${packageName}/${version || 'latest'}?json=true`, { json: true })
			.then(resp => resp.body.version);
	}

}

// https://github.com/bahmutov/to-exact-semver/blob/master/src/is-strict-semver.js
function isStrictSemver(version){
	return /^[0-9]+\.[0-9]+\.[0-9]+$/.test(version);
}