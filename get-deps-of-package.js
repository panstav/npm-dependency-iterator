const got = require('got');

const cache = {};

module.exports = getDepsOfPackage;

function getDepsOfPackage(packageName, version){
	version = version || 'latest';

	return getDepsFromCache(packageName, version)
		.then(data => {

			// if cache has the data, use it
			if (data) return data;

			// if no data was found on cache, fetch it from registry, and save it
			return getDepsFromNpm(packageName, version)
				.then(data => saveDepsToCache(packageName, version, data));

		});

}

function getDepsFromCache(packageName, version){
	const key = cacheKey(packageName, version);

	if (cache.hasOwnProperty(key)) return Promise.resolve(cache[key]);

	return Promise.resolve(null);
}

function saveDepsToCache(packageName, version, data){
	cache[cacheKey(packageName, version)] = data;
	
	return data;
}

function getDepsFromNpm(packageName, version){

	return got(`https://registry.npmjs.org/${packageName}/${version}?json=true`, { json: true })
		.then(resp => {

			// if package has no dependencies - return an empty array
			if (!resp.body.dependencies) return [];

			// otherwise parse dependencies object into an array and return it
			return Object.keys(resp.body.dependencies).map(key => { return { name: key, version: resp.body.dependencies[key] } });

		});

}

function cacheKey(packageName, version){
	return `${packageName}@${version}`;
}