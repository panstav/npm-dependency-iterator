const expect = require('expect.js');
const testPort = require('test-port');

describe('Network', () => {

	it('Should have default port available', done => {
		testPort(process.env.PORT || 3000, isListening => {

			expect(isListening).to.not.be.ok();
			done();

		});
	});

});