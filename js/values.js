var availableAlgos = [
	'sha256',
	'hmac-sha256',
	'sha1',
	'hmac-sha1',
	'md5',
	'hmac-md5',
	'rmd160',
	'hmac-rmd160'
];

var charsets = {
  'alpha': 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  'alphanum': 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
  'alphanumsym': 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`~!@#$%^&*()_-+={}|[]\\:";\'<>?,./',
  'hex': '0123456789abcdef',
  'num': '0123456789',
  'sym': '`~!@#$%^&*()_-+={}|[]\\:";\'<>?,./'
};

var defaultOptions = {
	hashAlgorithm: 'sha256',
	length: 8,
	modifier: '',
	charset: 'alphanumsym',
	customCharset: '',
	urlComponents: 'domain',
	useL33t: 'off',
	l33tLevel: 1,
	prefix: '',
	suffix: '',
	passwordVisibility: 'click',
	saveMasterPassword: 'memory',
	unicornpass: true,
	autoFillHiddenOnly: true
};
