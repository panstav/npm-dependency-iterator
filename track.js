const Keen = require('keen-js');

const log = require('./log');

const tracker = new Keen({
	projectId: process.env.KEEN_PROJECT_ID,
	writeKey: process.env.KEEN_WRITE_KEY,
	protocol: "https"
});

module.exports = track;

function track(category, data){
	return new Promise((resolve, reject) => {

		tracker.addEvent(category, data, err => {
			if (err) return reject(err);

			resolve();
		});

	});
}