const expect = require('expect.js');
const request = require('supertest-as-promised');

const utils = require('./utils');

const initServer = require('../server');

describe('Server', () => {

	var server;

	beforeEach(() => {
		server = initServer();
	});

	describe('/deps', () => {

		it('Should return 404 for a non-existent package', () => {

			return request(server)
				.get('/deps/non-existent-package')
				.expect(404);

		});

		it('Should return a indication for packages with on dependencies', () => {

			return request(server)
				.get('/deps/is-array')
				.expect(200)
				.then(noDependencies);

		});

		it('Should return valid json for an existing package', () => {

			return request(server)
				.get('/deps/supertest-as-promised')
				.expect(200)
				.then(res => utils.validFlatDependency(res.body));

		});

	});

	describe('/tree', () => {

		it('Should return 404 for a non-existent package', () => {

			return request(server)
				.get('/tree/non-existent-package')
				.expect(404);

		});

		it('Should return a indication for packages with on dependencies', () => {

			return request(server)
				.get('/deps/is-array')
				.expect(200)
				.then(noDependencies);

		});

		it('Should return valid json for an existing package', () => {

			return request(server)
				.get('/tree/supertest-as-promised')
				.expect(200)
				.then(res => utils.validDeepDependency(res.body));

		});

	});

});

function noDependencies(res){
	expect(res.text).to.contain('no dependencies');
}