const util = require('./js/util');
const loader = require('./js/loader');

util.onReady(() => {
	registerSwitcheryClickHandler();
});

function registerSwitcheryClickHandler(){
	util.forEachElem('[data-switch-on-click]', elem => elem.addEventListener('click', event => {
		const inputElem = buildInputToReplaceSwitchery(event.target.dataset.switchOnClick);
		swapAndFocus(inputElem);
	}));
}

function buildInputToReplaceSwitchery(packageName){
	const inputElem = document.createElement('input');
	inputElem.setAttribute('type', 'text');
	inputElem.setAttribute('value', packageName);
	inputElem.addEventListener('keydown', requestDependenciesOnEnter);

	return inputElem;
}

function swapAndFocus(inputElem){
	const switcheryContainer = document.getElementsByClassName('package-name-container')[0];
	switcheryContainer.innerHTML = '';
	switcheryContainer.appendChild(inputElem);
	inputElem.focus();
}

function requestDependenciesOnEnter(event){
	if (event.keyIdentifier === "Enter" || event.which === 13 || event.keyCode === 13){
		getDependencies(this.value.toLowerCase());
	}
}

function getDependencies(packageName){

	loader.show();

	util.ajax(`/tree/${packageName}`, yea, nah);

	function yea(err, tree){
		loader.hide();
		if (err) return console.error(err);
		appendTree(tree);
	}

	function nah(err){
		loader.hide();
		console.error(err);
	}

}

function appendTree(tree){
	document.querySelector('[data-dump]').innerHTML = `<pre>${tree}</pre>`;
	document.querySelector('section.results').style.display = 'block';
}