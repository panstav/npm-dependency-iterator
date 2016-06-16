const expect = require('expect.js');

const utils = require('./utils');

const getDeps = require('../logic/get-dependencies');

describe('getDeps', () => {

	it('Should return an empty array for packages with no dependencies', () => {

		return getDeps('is-array').then(deps => {
			expect(deps).to.be.an('array');
			expect(deps).to.be.empty();
		});

	});

	it('Should return a valid schema of dependencies', () => {

		return getDeps('supertest-as-promised').then(deps => utils.validFlatDependency(deps));

	});

	it('Should return the latest version of a package as default', () => {

		return getDeps('supertest-as-promised').then(defaultDeps => {
			return getDeps('supertest-as-promised', 'latest').then(latestDeps => {

				expect(defaultDeps.length).to.be.eql(latestDeps.length);

				defaultDeps.forEach(defaultDep => {
					const matchingDeps = latestDeps.filter(dep => dep.name === defaultDep.name);
					expect(matchingDeps).to.have.length(1);
					expect(matchingDeps[0].version).to.be.eql(defaultDep.version);
				});

			});
		});

	});

	describe('queryNpmForDeps', () => {

		it('Should return an empty array for packages with no dependencies', () => {

			return getDeps._.queryNpmForDeps('is-array', 'latest').then(deps => {
				expect(deps).to.be.an('array');
				expect(deps).to.be.empty();
			});

		});

		it('Should return a valid schema of dependencies', () => {

			return getDeps._.queryNpmForDeps('supertest-as-promised', 'latest').then(deps => utils.validFlatDependency(deps));

		});

	});

	describe('isStrictSemver', () => {

		it('Should accept strict semver', () => {
			expect(getDeps._.isStrictSemver('1.0.0')).to.be.ok();
			expect(getDeps._.isStrictSemver('1.2.0')).to.be.ok();
			expect(getDeps._.isStrictSemver('1.0.6')).to.be.ok();
		});

		it('Shouldn\'t accept any kinds of permissive version markers', () => {
			expect(getDeps._.isStrictSemver('~1.0.0')).to.not.be.ok();
			expect(getDeps._.isStrictSemver('^1.2.0')).to.not.be.ok();
		});

		it('Should also return false for other formats too', () => {
			expect(getDeps._.isStrictSemver('%1.0.0')).to.not.be.ok();
			expect(getDeps._.isStrictSemver('2')).to.not.be.ok();
			expect(getDeps._.isStrictSemver('2.0')).to.not.be.ok();
		});

	});


});