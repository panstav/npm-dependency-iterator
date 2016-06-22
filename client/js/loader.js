module.exports = {
	show: () => setLoaderState('active'),
	hide: () => setLoaderState('')
};

function setLoaderState(newState){
	document.querySelector('[data-overlay]').setAttribute('data-overlay', newState);
}