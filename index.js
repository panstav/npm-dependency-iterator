// load environment variables and don't throw missing-env-file warning if env.production
require('dotenv').config({ silent: process.env.NODE_ENV === 'production' });

const initServer = require('./server');
const log = require('./log');

const port = process.env.PORT || 3000;

initServer().listen(port, () => {
	log.info(`Listening on port ${port}`);
});