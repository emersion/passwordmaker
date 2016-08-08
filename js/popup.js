var parseUrl = require('url').parse;
var makePassword = require('passwordmaker');
var debounce = require('debounce');
var crypto_ = require('crypto'); // TODO: browser crypto overrides crypto var
var unicornpass = require('unicornpass');
var once = require('async-once-save');

var inputs = {
	domain: document.getElementById('domain'),
	masterPassword: document.getElementById('master-password'),
	generatedPassword: document.getElementById('generated-password')
};

var buttons = {
	copy: document.getElementById('btn-copy'),
	autoFill: document.getElementById('btn-auto-fill'),
	options: document.getElementById('btn-options')
};

var unicornpassBar = document.getElementById('unicornpass');

var ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;

var prefs = null;

var optionsStorage = browser.storage.sync || browser.storage.local;
var masterPasswordStorage = browser.storage.local;

function loadOptions(done) {
	optionsStorage.get(defaultOptions, function (items) {
		prefs = items;
		done();
	});
}

function getActiveTab(done) {
	browser.tabs.query({
		active: true,
		currentWindow: true
	}, function (tabs) {
		done(tabs[0]);
	});
}

function loadMasterPassword(done) {
	function gotPassword(password) {
		inputs.masterPassword.value = password;
		done(password.length > 0);
	}

	switch (prefs.saveMasterPassword) {
	case 'memory':
		browser.runtime.sendMessage({
			type: 'get-password'
		}, gotPassword);
		break;
	case 'disk':
		masterPasswordStorage.get({
			masterPassword: ''
		}, function (items) {
			if (items.masterPassword) {
				gotPassword(items.masterPassword);
			}
		});
		break;
	default:
		done(false);
	}
}

function saveMasterPassword() {
	var masterPassword = inputs.masterPassword.value;

	switch (prefs.saveMasterPassword) {
	case 'memory':
		browser.runtime.sendMessage({
			type: 'set-password',
			password: masterPassword
		});
		break;
	case 'disk':
		masterPasswordStorage.set({
			masterPassword: masterPassword
		});
		break;
	}
}

var loadClientId = once(function (done) {
	optionsStorage.get({
		clientId: ''
	}, function (items) {
		var clientId = items.clientId;

		if (!clientId) {
			clientId = crypto_.randomBytes(32).toString('hex');

			return optionsStorage.set({
				clientId: clientId
			}, function () {
				done(clientId);
			});
		}

		done(clientId);
	});
});

function generateUnicornpass() {
	if (!prefs.unicornpass) return;

	loadClientId(function (clientId) {
		var password = inputs.masterPassword.value;

		var style = { visibility: 'hidden' };
		if (password) {
			style = unicornpass(clientId + password);
			style.visibility = 'visible';
		}

		for (var key in style) {
			unicornpassBar.style[key] = style[key];
		}
	});
}

function autoFillPassword() {
	var password = inputs.generatedPassword.value;

	if (password.length !== 0) {
		password = password.replace(/"/g, '\\"');

		var code = 'var el = document.activeElement;';
		if (prefs.autoFillHiddenOnly) {
			// Check that the active input is a password input
			code += 'if (el && el.tagName.toLowerCase() == "input" && el.type == "password") {';
		} else {
			code += 'if (el) {';
		}

		code += '	el.value = "' + password + '";' +
			'	el.dispatchEvent(new KeyboardEvent("input"))' +
			'}';

		browser.tabs.executeScript({ code: code });

		window.close();
	}
}

function isGeneratedPasswdRevealed() {
	return (inputs.generatedPassword.type == 'text');
}
function revealGeneratedPasswd() {
	inputs.generatedPassword.type = 'text';
	inputs.generatedPassword.select();
}
function hideGeneratedPasswd() {
	inputs.generatedPassword.type = 'password';
}

function generatePassword() {
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

function initUi() {
	var generatePasswordDebounced = debounce(generatePassword, 300);
	var generateUnicornpassDebounced = debounce(generateUnicornpass, 300);

	// Listen for keyup events
	inputs.domain.addEventListener('keyup', function () {
		generatePasswordDebounced();
	});
	inputs.masterPassword.addEventListener('keyup', function () {
		generatePasswordDebounced();
		generateUnicornpassDebounced();
	});
	inputs.masterPassword.addEventListener('change', function () {
		saveMasterPassword();
	});

	inputs.generatedPassword.addEventListener('mouseover', function () {
		if (prefs && prefs.passwordVisibility == 'hover') {
			revealGeneratedPasswd();
		}
	});
	inputs.generatedPassword.addEventListener('mouseout', function () {
		if (prefs && prefs.passwordVisibility == 'hover') {
			hideGeneratedPasswd();
		}
	});
	inputs.generatedPassword.addEventListener('focus', function () {
		if (!inputs.generatedPassword.value.length) {
			generatePassword();
		}
		if (prefs && prefs.passwordVisibility == 'click') {
			revealGeneratedPasswd();
		}
	});
	inputs.generatedPassword.addEventListener('blur', function () {
		if (prefs && prefs.passwordVisibility == 'click') {
			hideGeneratedPasswd();
		}
	});
	inputs.generatedPassword.addEventListener('click', function () {
		if (prefs && prefs.passwordVisibility == 'click' && !isGeneratedPasswdRevealed()) {
			revealGeneratedPasswd();
		}
	});

	// Listen for clicks on buttons
	buttons.copy.addEventListener('click', function () {
		inputs.generatedPassword.select();

		var success = false;
		try {
			success = document.execCommand('copy');
		} catch (err) {}

		if (success) {
			window.close();
		}
	});

	// Auto-fill password
	document.addEventListener('keypress', function (event) {
		if (event.keyCode == 13) { // Enter key
			event.preventDefault();
			autoFillPassword();
		}
	});
	buttons.autoFill.addEventListener('click', function () {
		autoFillPassword();
	});

	buttons.options.addEventListener('click', function (event) {
		if (browser.runtime.openOptionsPage) {
			browser.runtime.openOptionsPage();
		} else {
			window.open(browser.runtime.getURL('options.html'));
		}
		window.close();
	});

	loadOptions(function () {
		if (prefs.passwordVisibility == 'always') {
			revealGeneratedPasswd();
		} else {
			hideGeneratedPasswd();
		}

		if (prefs.unicornpass) {
			unicornpassBar.style.display = 'block';
			unicornpassBar.style.visibility = 'hidden';
		}

		getActiveTab(function (tab) {
			if (!tab || !tab.url) return;

			var host = parseUrl(tab.url).hostname;
			if (prefs.urlComponents == 'domain' && !ipRegex.test(host)) {
				host = host.split('.').slice(-2).join('.');
			}
			inputs.domain.value = host;

			loadMasterPassword(function (loaded) {
				if (!loaded) {
					if (!host) {
						inputs.domain.focus();
					} else {
						inputs.masterPassword.focus();
					}
				} else {
					generatePassword();
					generateUnicornpass();
					inputs.generatedPassword.focus();
				}
			});
		});
	});
}

initUi();
