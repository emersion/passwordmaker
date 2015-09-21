/*
PasswordMaker - Creates and manages passwords
Copyright (C) 2005 Eric H. Jung and LeahScape, Inc.
Chrome Version by Richard Musiol
http://passwordmaker.org/
This library is free software; you can redistribute it and/or modify it
under the terms of the GNU Lesser General Public License as published by
the Free Software Foundation; either version 2.1 of the License, or (at
your option) any later version.
This library is distributed in the hope that it will be useful, but WITHOUT
ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
FITNESSFOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License
for more details.
You should have received a copy of the GNU Lesser General Public License
along with this library; if not, write to the Free Software Foundation,
Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307 USA
*/

function generatePassword(opts) {
  opts = opts || {};

  var hashAlgorithm = opts.hashAlgorithm,
    key = opts.master,
    url = opts.url,
    username = opts.username,
    modifier = opts.modifier,
    whereToUseL33t = opts.whereToUseL33t,
    l33tLevel = opts.l33tLevel,
    length = opts.length,
    charset = opts.charset,
    prefix = opts.prefix,
    suffix = opts.suffix;

  // Never *ever, ever* allow the charset's length<2 else
  // the hash algorithms will run indefinitely
  if (charset.length < 2) {
    return '';
  }

  // Calls generate() n times in order to support passwords
  // of arbitrary length regardless of character set length.
  var password = "";
  var count = 0;
  while (password.length < length) {
    // To maintain backwards compatibility with all previous versions of passwordmaker,
    // the first call to _generatepassword() must use the plain "key".
    // Subsequent calls add a number to the end of the key so each iteration
    // doesn't generate the same hash value.
    password += (count == 0) ?
    generate(hashAlgorithm, key,
      url + username + modifier, whereToUseL33t, l33tLevel,
      length, charset, prefix, suffix) :
    generate(hashAlgorithm, key + '\n' + count, 
      url + username + modifier, whereToUseL33t, l33tLevel,
      length, charset, prefix, suffix);
    count++;
  }

  if (prefix)
    password = prefix + password;
  if (suffix)
    password = password.substring(0, length - suffix.length) + suffix;

  return password.substring(0, length);
}

function generate(hashAlgorithm, key, data, whereToUseL33t, l33tLevel, passwordLength, charset, prefix, suffix) {
  // for non-hmac algorithms, the key is master pw and url concatenated
  var usingHMAC = hashAlgorithm.indexOf("hmac") > -1;
  if (!usingHMAC)
    key += data;

  // apply l33t before the algorithm?
  if (whereToUseL33t == "both" || whereToUseL33t == "before-hashing") {
    key = PasswordMaker_l33t.convert(l33tLevel, key);
    if (usingHMAC) {
      data = PasswordMaker_l33t.convert(l33tLevel, data); // new for 0.3; 0.2 didn't apply l33t to _data_ for HMAC algorithms
    }
  }

  // apply the algorithm
  var password = "";
  switch(hashAlgorithm) {
    case "sha256":
    password = PasswordMaker_SHA256.any_sha256(key, charset);
    break;
    case "hmac-sha256":
    password = PasswordMaker_SHA256.any_hmac_sha256(key, data, charset, true);
    break;
    case "hmac-sha256_fix":
    password = PasswordMaker_SHA256.any_hmac_sha256(key, data, charset, false);
    break;
    case "sha1":
    password = PasswordMaker_SHA1.any_sha1(key, charset);
    break;
    case "hmac-sha1":
    password = PasswordMaker_SHA1.any_hmac_sha1(key, data, charset);
    break;
    case "md4":
    password = PasswordMaker_MD4.any_md4(key, charset);
    break;
    case "hmac-md4":
    password = PasswordMaker_MD4.any_hmac_md4(key, data, charset);
    break;
    case "md5":
    password = PasswordMaker_MD5.any_md5(key, charset);
    break;
    case "md5_v6":
    password = PasswordMaker_MD5_V6.hex_md5(key, charset);
    break;
    case "hmac-md5":
    password = PasswordMaker_MD5.any_hmac_md5(key, data, charset);
    break;
    case "hmac-md5_v6":
    password = PasswordMaker_MD5_V6.hex_hmac_md5(key, data, charset);
    break;
    case "rmd160":
    password = PasswordMaker_RIPEMD160.any_rmd160(key, charset);
    break;
    case "hmac-rmd160":
    password = PasswordMaker_RIPEMD160.any_hmac_rmd160(key, data, charset);
    break;
  }
  // apply l33t after the algorithm?
  if (whereToUseL33t == "both" || whereToUseL33t == "after-hashing")
    return PasswordMaker_l33t.convert(l33tLevel, password);
  return password;
}