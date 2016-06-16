const initServer = require('./server');
const port = process.env.PORT || 3000;

initServer().listen(port, () => {
	console.info(`Listening on port ${port}`);
});