const getDepsOfPackage = require('./get-deps-of-package');

module.exports = iteratePackage;

// this bit is confusing, so here goes

function iteratePackage(depArray){

	// depArray is an array of dependencies of a certain package
	// each object in this array has 'name' and 'version' properties, like this:
	// [{ name, version }, { name, version }, { name, version }]

	// populate the 'deps' property of each of those dependencies
	return populateDepLists(depArray).then(populatedDepArray => {

		// populatedDepArray is a two dimensional array of dependencies
		// each item in this array has a 'deps' property that looks exactly like depArray did

		return iterateFarther(populatedDepArray).then(populatedNestedDepArrays => {
			populatedDepArray.deps = populatedNestedDepArrays;
			return populatedDepArray;
		});

	});

}

function iterateFarther(depArray){

	// return an array of promises to iterate the nested depArrays just like we did with the first depArray
	return Promise.all(depArray
		.filter(pkg => pkg.deps.length !== 0)
		.map(dependantPackage => iteratePackage(dependantPackage.deps)));

}

function populateDepLists(depArray){

	// return an array of promises to populate the 'deps' property of every pkg object in given depArray
	return Promise.all(depArray.map(pkg => getDepsOfPackage(pkg.name, pkg.version).then(pkgDeps => {
		pkg.deps = pkgDeps;
		return pkg;
	})));

}