const initServer = require('./server');
const log = require('./log');

const port = process.env.PORT || 3000;

initServer().listen(port, () => {
	log.info(`Listening on port ${port}`);
});