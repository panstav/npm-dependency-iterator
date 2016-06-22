module.exports = {
	onReady,
	forEachElem,
	ajax
};

function onReady(fn){
	if (document.readyState != 'loading') return fn();

	if (document.addEventListener) return document.addEventListener('DOMContentLoaded', fn);

	document.attachEvent('onreadystatechange', () => {
		if (document.readyState != 'loading') fn();
	});
}

function forEachElem(identifier, parent, fn){

	if (typeof(parent) === 'function'){
		fn = parent;
		parent = document;
	}

	// resolve to an iterate-able list of elements
	// identifier would be either a string pointer to elements -> query by pointer
	// or a list which could be directly iterated with forEach, or something that can transformed to
	var elements = identifier;

	if (isString(identifier)) elements = parent.querySelectorAll(identifier);
	if (!isArray(elements)) elements = [].slice.call(elements);

	// pass the elements one by one to the given fn
	elements.forEach(fn);

	function isString(str){
		return typeof(str) === 'string';
	}

	function isArray(arr){
		const toStr = toString || {}.toString;
		return toStr.call(arr) === '[object Array]';
	}

}

function ajax(url, data, callback, fallback){

	if (typeof(data) === 'function'){
		if (typeof(callback) === 'function') fallback = callback;
		callback = data;
		data = undefined;
	}

	const request = new XMLHttpRequest();

	request.open(data ? 'POST' : 'GET', url, true);

	if (data) request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

	request.onload = () => {
		if (request.status >= 200 && request.status < 400) return callback(null, request.responseText);

		callback({ response: request.responseText, status: request.status });
	};

	request.onerror = fallback || console.error.bind(console);

	request.send(JSON.stringify(data));
}