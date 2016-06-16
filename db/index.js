const db = require('levelup')(__dirname, { valueEncoding: 'json' });

const log = require('./../log');

module.exports = {

	get: (packageName, version) => {
		return new Promise((resolve, reject) => {

			const key = cacheKey(packageName, version);

			log.debug(`DB: Retrieving '${key}'`);

			db.get(key, (err, data) => {
				if (err){
					if (err.notFound) return resolve();

					return reject(err);
				}

				resolve(data);
			});

		});
	},

	set: (packageName, version, data) => {
		return new Promise((resolve, reject) => {

			const key = cacheKey(packageName, version);

			log.debug(`DB: Saving '${key}'`);

			db.put(key, data, err => {
				if (err) return reject(err);

				resolve(data);
			});

		});
	}
	
};

function cacheKey(packageName, version){
	return `${packageName}@${version}`;
}