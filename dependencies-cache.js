const cache = {};

module.exports = {

	list: () => Promise.resolve(Object.keys(cache).length ? cache : null),

	get: (packageName, version) => {
		const key = cacheKey(packageName, version);

		if (cache.hasOwnProperty(key)) return Promise.resolve(cache[key]);

		return Promise.resolve(null);
	},

	set: (packageName, version, data) => {
		cache[cacheKey(packageName, version)] = data;

		return Promise.resolve(data);
	}
	
};

function cacheKey(packageName, version){
	return `${packageName}@${version}`;
}