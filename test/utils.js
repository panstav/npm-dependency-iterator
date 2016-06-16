const expect = require('expect.js');

module.exports = {
	validFlatDependency,
	validDeepDependency
};

function validFlatDependency(deps){
	expect(deps).to.be.an('array');
	deps.forEach(dep => {
		expect(dep).to.be.an('object');
		expect(dep).to.only.have.keys(['name', 'version'])
	});
}

function validDeepDependency(deps){
	expect(deps).to.be.an('array');
	deps.forEach(dep => {
		expect(dep).to.be.an('object');
		expect(dep).to.only.have.keys(['name', 'version', 'deps']);
	});
}