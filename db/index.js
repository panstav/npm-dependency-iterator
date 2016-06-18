const db = require('levelup')(__dirname, { valueEncoding: 'json' });

const log = require('./../log');

module.exports = {

	get: (packageName, version) => {
		return new Promise((resolve, reject) => {

			const key = pkgKey(packageName, version);

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

			const key = pkgKey(packageName, version);

			log.debug(`DB: Saving '${key}'`);

			db.put(key, data, err => {
				if (err) return reject(err);

				// resolve saved data for .then chain
				resolve(data);
			});

		});
	}
	
};

function pkgKey(packageName, version){
	return `${packageName}@${version}`;
}