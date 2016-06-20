const util = require('./util');

var loaderElem;
util.onReady(() => {
	loaderElem = document.querySelector('[data-overlay]');
});

module.exports = {
	show: () => setLoaderState('active'),
	hide: () => setLoaderState('')
};

function setLoaderState(state){
	loaderElem.setAttribute('data-overlay', state);
}