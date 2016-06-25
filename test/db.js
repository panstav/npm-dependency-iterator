const expect = require('expect.js');

const db = require('../db').dependencies;

describe('DB', () => {

	const lorem = {
		data: { same: 'data' },
		test: returnedLoremData => {
			expect(returnedLoremData).to.be.an('object');
			expect(returnedLoremData).to.have.property('same');
			expect(returnedLoremData.same).to.eql('data');
		}
  };

	it('Should perform the basic get/set routine', () => {

		return db.set('test-pkg', '1.0.0', lorem.data)
			.then(() => db.get('test-pkg', '1.0.0'))
			.then(lorem.test);

	});

	it('Should return the save data after successful update op', () => {
		
		return db.set('test-returned', '1.0.0', lorem.data).then(lorem.test);
		
	});

});