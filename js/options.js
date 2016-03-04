var controls = {
	hashAlgorithm: document.getElementById('option-hash-algorithm'),
	length: document.getElementById('option-length'),
	charset: document.getElementById('option-charset'),
	customCharset: document.getElementById('option-custom-charset'),
	urlComponents: document.getElementById('option-url-components'),
	passwordVisibility: document.getElementById('option-password-visibility'),
	saveMasterPassword: document.getElementById('option-save-master-password'),
	unicornpass: document.getElementById('option-unicornpass'),
	useL33t: document.getElementById('option-use-l33t'),
	l33tLevel: document.getElementById('option-l33t-level'),
	modifier: document.getElementById('option-modifier'),
	prefix: document.getElementById('option-prefix'),
	suffix: document.getElementById('option-suffix')
};

var optionsStorage = chrome.storage.sync || chrome.storage.local;

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

function saveOptions() {
	optionsStorage.set({
		hashAlgorithm: controls.hashAlgorithm.value,
		length: parseInt(controls.length.value, 10),
		modifier: controls.modifier.value,
		charset: controls.charset.value,
		customCharset: controls.customCharset.value,
		urlComponents: controls.urlComponents.value,
		useL33t: controls.useL33t.value,
		l33tLevel: parseInt(controls.l33tLevel.value, 10),
		prefix: controls.prefix.value,
		suffix: controls.suffix.value,
		passwordVisibility: controls.passwordVisibility.value,
		saveMasterPassword: controls.saveMasterPassword.value,
		unicornpass: controls.unicornpass.checked
	}, function () {
		document.getElementById('options-saved').style.visibility = 'visible';
	});
}

function loadOptions() {
	optionsStorage.get(defaultOptions, function (items) {
		Object.keys(items).forEach(function (key) {
			if (controls[key].type === 'checkbox') {
				controls[key].checked = items[key];
			} else {
				controls[key].value = items[key];
			}
		});
	});
}

initUi();
