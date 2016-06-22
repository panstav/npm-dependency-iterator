## Installation

* Traverse to where you're comfortable and clone this repo

		$ cd /path/to/your/stuff
		$ git clone https://github.com/panstav/npm-dependency-iterator.git
		$ cd npm-dependency-iterator/

* Install dependencies and run th build - go have a snack while it does that.

		$ npm i
		$ node_modules/.bin/gulp build

## Usage

* Run tests with `$ npm test`. You may need to run `$ npm i --only=dev` if for some reason you're installing this on production.
* Start the server with `$ npm start`, you can choose a port to have the server listen to with `$ PORT=1234 npm start`