const getDeps = require('./get-dependencies');

module.exports = iterateTree;

// this bit is confusing, so here goes

function iterateTree(topPackage){

	// topPackage is an array of dependencies of a certain package
	// each object in this array has 'name' and 'version' properties, like this:
	// [{ name, version }, { name, version }, { name, version }]

	// populate the 'deps' property of each of those dependencies
	return populateDeps(topPackage).then(populatedDepArray => {

		// populatedDepArray is a two dimensional array of dependencies
		// each item in this would be the next topPackage

		return iterateFarther(populatedDepArray).then(populatedNestedDepArrays => {
			populatedDepArray.deps = populatedNestedDepArrays;
			return populatedDepArray;
		});
	});
}

function iterateFarther(depArray){

	const promisesOfFartherIterations = depArray

		// return only packages that have their own dependencies
		.filter(pkg => pkg.deps.length !== 0)

		// return an array of promises to iterate the arrays of nested dependencies
		.map(dependantPackage => iterateTree(dependantPackage.deps));

	return Promise.all(promisesOfFartherIterations);
}

function populateDeps(depArray){

	const promisesOfDepPopulation = depArray.map(pkg => {

		return getDeps(pkg.name, pkg.version).then(pkgDeps => {
			pkg.deps = pkgDeps;
			return pkg;
		});
	});

	// return an array of promises to populate the 'deps' property of every pkg object in given depArray
	return Promise.all(promisesOfDepPopulation);
}