const nodeCache = require('node-cache');
const cache = new nodeCache();

const log = require('./log');

module.exports = {

	list: () => {
		const allKeys = cache.keys();

		return Promise.resolve(allKeys.length ? cache.mget(allKeys) : null);
	},

	get: (packageName, version) => {
		const key = cacheKey(packageName, version);

		log.debug(`DB: Retrieving '${key}'`);

		return Promise.resolve(cache.get(key));
	},

	set: (packageName, version, data) => {
		const key = cacheKey(packageName, version);

		log.debug(`DB: Saving '${key}'`);

		cache.set(key, data);

		return Promise.resolve(data);
	}
	
};

function cacheKey(packageName, version){
	return `${packageName}@${version}`;
}