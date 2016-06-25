# npm Dependency Iterator [![Build Status](https://travis-ci.org/panstav/npm-dependency-iterator.svg?branch=master)](https://travis-ci.org/panstav/npm-dependency-iterator)

> A responsive demo interface for a recursive dependency list resolver.

**To do:**
* Thorough code review.
* Optimize iteration of really big packages.
* Write more tests and integrate a coverage estimate.
* Outsource logic, leave client-side interface here for show-off.

## Installation

* Traverse to where you're comfortable and clone this repo

		$ cd /path/to/your/stuff
		$ git clone https://github.com/panstav/npm-dependency-iterator.git
		$ cd npm-dependency-iterator/

* Install dependencies and run the build - have a break while it does that.

		$ npm install && node_modules/.bin/gulp build

## Usage

* Run tests with `$ npm test`. You may need to run `$ npm i --only=dev` if npm didn't fetch those packages too (installing this on production?).
* Start the server with `$ npm start`, to choose a port for the server to listen - go `$ PORT=1234 npm start`