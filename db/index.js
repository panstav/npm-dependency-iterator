const level = require('levelup');
const database = require('leveldown');

const log = require('../log');

const dirs = {
	dependencies: `${__dirname}/dependencies`,
	versions: `${__dirname}/versions`
};

const dependenciesDB = level(dirs.dependencies, { valueEncoding: 'json' });
const versionsDB = level(dirs.versions, { valueEncoding: 'json' });

module.exports = {

	dependencies: {
		get: getDependencies,
		set: setDependencies
	},

	versions: {
		get: getVersions,
		add: addVersion
	},

	clean: cleanDatabases

};

function getDependencies(packageName, version){
	return new Promise((resolve, reject) => {

		const key = pkgKey(packageName, version);

		log.debug(`DB: Retrieving dependencies of '${key}'`);

		dependenciesDB.get(key, (err, data) => {
			if (err){
				if ('notFound' in err) return resolve();

				return reject(err);
			}

			resolve(data);
		});
	});
}

function setDependencies(packageName, version, data){
	return new Promise((resolve, reject) => {

		getDependencies(packageName, version).then(saveOrSkip, reject);

		function saveOrSkip(savedData){

			// if data is already there, skip
			if (savedData) return resolve(savedData);

			const key = pkgKey(packageName, version);

			log.debug(`DB: Saving dependencies of '${key}'`);

			dependenciesDB.put(key, data, err => {
				if (err) return reject(err);

				// resolve after indexing the version, with saved data for .then chain
				addVersion(packageName, version)
					.then(() => resolve(data), reject);

			});
		}

	});
}

function getVersions(packageName){
	return new Promise((resolve, reject) => {

		log.debug(`DB: Retrieving versions of '${packageName}'`);

		versionsDB.get(packageName, (err, data) => {
			if (err){
				if ('notFound' in err) return resolve();

				return reject(err);
			}

			resolve(data);
		});
	});
}

function addVersion(packageName, version){
	return new Promise((resolve, reject) => {

		log.debug(`DB: Saving version of '${packageName}'`);

		versionsDB.get(packageName, (err, data) => {

			// reject on error, unless it's notFound
			if (err && !'notFound' in err) return reject(err);

			data = data || [];
			if (data.indexOf(version) > -1) return resolve(data);

			data.push(version);

			versionsDB.put(packageName, data, err => {
				if (err) return reject(err);

				resolve(data);
			});
		});
	});
}

function cleanDatabases(){
	return new Promise((resolve, reject) => {

		return closeDatabases().then(destroyDatabases).then(reopenDatabases);

		function closeDatabases(){
			return new Promise(resolve => {
				dependenciesDB.close(() => versionsDB.close(() => resolve() ));
			});
		}

		function destroyDatabases(){

			database.destroy(dirs.dependencies, err =>{
				if (err) return reject(err);

				database.destroy(dirs.versions, err => {
					if (err) return reject(err);

					resolve();
				});
			});

		}

		function reopenDatabases(){
			return new Promise(resolve => {
				dependenciesDB.open(() => versionsDB.open(() => resolve() ));
			});
		}

	});

}

function pkgKey(packageName, version){
	return `${packageName}@${version}`;
}