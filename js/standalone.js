var makePassword = require('passwordmaker');
var debounce = require('debounce');

var form = document.getElementById('standalone-form');

var inputs = {
	domain: document.getElementById('domain'),
	masterPassword: document.getElementById('master-password'),
	generatedPassword: document.getElementById('generated-password'),

  // Options
  hashAlgorithm: document.getElementById('option-hash-algorithm'),
	length: document.getElementById('option-length'),
	charset: document.getElementById('option-charset'),
	customCharset: document.getElementById('option-custom-charset'),
	useL33t: document.getElementById('option-use-l33t'),
	l33tLevel: document.getElementById('option-l33t-level'),
	modifier: document.getElementById('option-modifier'),
	prefix: document.getElementById('option-prefix'),
	suffix: document.getElementById('option-suffix')
};

var buttons = {
	copy: document.getElementById('btn-copy')
};

function initUi() {
	availableAlgos.forEach(function (algo) {
		var el = document.createElement('option');
		el.text = algo;
		el.value = algo;
		inputs.hashAlgorithm.appendChild(el);
	});

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    generatePassword();
  });

  form.addEventListener('change', function () {
    generatePassword();
  });

	var generatePasswordDebounced = debounce(generatePassword, 500);

  inputs.domain.addEventListener('keyup', function () {
  	generatePasswordDebounced();
  });
  inputs.masterPassword.addEventListener('keyup', function () {
  	generatePasswordDebounced();
  });

  buttons.copy.addEventListener('click', function () {
    inputs.generatedPassword.select();

    var success = false;
    try {
      success = document.execCommand('copy');
    } catch (err) {}
  });

  loadOptions();
}

function loadOptions() {
  Object.keys(defaultOptions).forEach(function (key) {
    if (!inputs[key]) return;
    inputs[key].value = defaultOptions[key];
  });
}

function getOptions() {
  var options = {};

  Object.keys(defaultOptions).forEach(function (key) {
    if (!inputs[key]) return;
    options[key] = inputs[key].value;
  });

  return options;
}

function generatePassword() {
  var prefs = getOptions();

  var charset = charsets[prefs.charset];
  if (prefs.charset == 'custom') {
    charset = prefs.customCharset;
  }

  var opts = {
		data: inputs.domain.value,
		masterPassword: inputs.masterPassword.value,
		modifier: prefs.modifier,
		hashAlgorithm: prefs.hashAlgorithm,
		whereToUseL33t: prefs.useL33t,
		l33tLevel: prefs.l33tLevel,
		length: prefs.length,
		prefix: prefs.prefix,
		suffix: prefs.suffix,
		charset: charset
	};

  if (!opts.masterPassword) {
    return;
  }

	var password = '';
	try {
		password = makePassword(opts)
	} catch (err) {
		console.error(err);
	}

	inputs.generatedPassword.value = password;
}

initUi();
