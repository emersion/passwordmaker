var browser = window.browser || window.chrome;

var savedPassword = '';

browser.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
	switch (msg.type) {
	case 'set-password':
		savedPassword = msg.password;
		sendResponse(null);
		break;
	case 'get-password':
		sendResponse(savedPassword);
		break;
	}
});
