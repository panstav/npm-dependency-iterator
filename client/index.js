const util = require('./js/util');
const loader = require('./js/loader');

util.onReady(registerSwitcheryClickHandler);

function registerSwitcheryClickHandler(){
	util.forEachElem('[data-switch-on-click]', elem => { elem.addEventListener('click', event => {

		// collect element, package clicked and type
		const li = event.currentTarget;
		const packageName = li.dataset.switchOnClick;

		// swap switchery with an input

		const containerElem = document.getElementsByClassName('package-name-container')[0];

		const inputElem = document.createElement('input');
		inputElem.setAttribute('type', 'text');
		inputElem.setAttribute('value', packageName);
		inputElem.addEventListener('keydown', event => { if (event.keyIdentifier === "Enter" || event.which === 13 || event.keyCode === 13){
			dumpAjax(inputElem.value.toLowerCase());
		}});

		containerElem.innerHTML = '';
		containerElem.appendChild(inputElem);
	})});
}

function dumpAjax(packageName){

	loader.show();

	util.ajax(`/tree/${packageName}`, appendTree, err => {
		loader.hide();
		console.error(err);
	});

	function appendTree(err, data){
		loader.hide();

		if (err) return console.error(err);

		const dumpElem = document.querySelector('[data-dump]');
		dumpElem.innerHTML = `<pre>${data}</pre>`;

		document.querySelector('section.results').style.display = 'block';
	}

}