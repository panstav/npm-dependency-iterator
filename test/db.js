const expect = require('expect.js');

const db = require('../db').dependencies;

describe('DB', () => {

	const loremData = { same: 'data' };

	it('Should perform the basic I/O', () => {

		return db.set('test-pkg', '1', loremData)
			.then(() => db.get('test-pkg', '1'))
			.then(loremDataTests);

	});

	describe('Set', () => {

		it('Should return the save data after successful update op', () => {
			return db.set('test-returned', '1', loremData).then(loremDataTests);
		});

	});

	function loremDataTests(returnedloremData){
		expect(returnedloremData).to.be.an('object');
		expect(returnedloremData).to.have.property('same');
		expect(returnedloremData.same).to.eql('data');
	}

});