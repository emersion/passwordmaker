var controls = {
	hashAlgorithm: document.getElementById('option-hash-algorithm'),
	length: document.getElementById('option-length'),
	charset: document.getElementById('option-charset'),
	customCharset: document.getElementById('option-custom-charset'),
	urlComponents: document.getElementById('option-url-components'),
	passwordVisibility: document.getElementById('option-password-visibility'),
	saveMasterPassword: document.getElementById('option-save-master-password'),
	unicornpass: document.getElementById('option-unicornpass'),
	autoFillHiddenOnly: document.getElementById('option-auto-fill-hidden-only'),
	useL33t: document.getElementById('option-use-l33t'),
	l33tLevel: document.getElementById('option-l33t-level'),
	modifier: document.getElementById('option-modifier'),
	prefix: document.getElementById('option-prefix'),
	suffix: document.getElementById('option-suffix')
};

var optionsStorage = browser.storage.sync || browser.storage.local;

function initUi() {
	availableAlgos.forEach(function (algo) {
		var el = document.createElement('option');
		el.text = algo;
		el.value = algo;
		controls.hashAlgorithm.appendChild(el);
	});

	document.getElementById('options-form').addEventListener('submit', function (event) {
		event.preventDefault();
		saveOptions();
	});

	loadOptions();
}

function getOptionValue(name) {
	var control = controls[name];
	if (!control) return;

	var value = control.value;
	if (control.tagName.toLowerCase() == 'input') {
		if (control.type == 'number') {
			value = parseFloat(value);
		}
		if (control.type == 'checkbox') {
			value = control.checked;
		}
	}

	return value;
}

function saveOptions() {
	var items = {};

	Object.keys(controls).forEach(function (key) {
		items[key] = getOptionValue(key);
	});

	optionsStorage.set(items, function () {
		document.getElementById('options-saved').style.visibility = 'visible';
	});
}

function loadOptions() {
	optionsStorage.get(defaultOptions, function (items) {
		Object.keys(items).forEach(function (key) {
			var control = controls[key];
			var value = items[key];

			if (control.type === 'checkbox') {
				control.checked = value;
			} else {
				control.value = value;
			}
		});
	});
}

initUi();
