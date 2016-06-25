const expect = require('expect.js');

module.exports = {
	depTreeIsFlat,
	depTreeIsDeep
};

function depTreeIsFlat(deps){
	expect(deps).to.be.an('array');
	deps.forEach(dep => {
		expect(dep).to.be.an('object');
		expect(dep).to.only.have.keys(['name', 'version']);
	});
}

function depTreeIsDeep(deps){
	expect(deps).to.be.an('array');
	deps.forEach(dep => {
		expect(dep).to.be.an('object');
		expect(dep).to.only.have.keys(['name', 'version', 'deps']);
	});
}