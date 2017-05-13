# PasswordMaker

PasswordMaker powered by WebExtension.

> Be aware of [PasswordMaker flaws](https://tonyarcieri.com/4-fatal-flaws-in-deterministic-password-managers) before using it!

![PasswordMaker 0.11](https://cloud.githubusercontent.com/assets/506932/8762930/6fca6812-2d87-11e5-911b-6a7e354fcc45.png)

Features:
* Action button with domain name autocompletion, master password saving (in Firefox's secure database) and clipboard support
* Preferences to manage the profile
* 8 hashing algorithms:
  * SHA-1
  * HMAC-SHA-1
  * SHA-256
  * HMAC-SHA-256
  * MD5
  * HMAC-MD5
  * RIPEMD-160
  * HMAC-RIPEMD-160
* 6 included character sets
* Latest and greatest circular icon technology

How does it work?
-----------------

![diagram](https://cloud.githubusercontent.com/assets/506932/3291715/4b9b80d6-f587-11e3-9115-d322e5748806.png)

Usage
-----

* Chrome/Chromium: https://chrome.google.com/webstore/detail/password-maker-x/jflmpillkkjcfahcokhkedcfkbeiejmc
* Firefox: https://addons.mozilla.org/en-US/firefox/addon/passwordmaker-x/
* Opera: soon
* Edge: partial support (some APIs are still missing)
* Standalone version: https://www.emersion.fr/passwordmaker/

> There is also an Android app available: https://play.google.com/store/apps/details?id=io.github.eddieringle.android.apps.passwordmaker

Building
--------

Install dependencies:
```
npm install
```

Generate the library from [`node-passwordmaker`](https://github.com/emersion/node-passwordmaker):
```
npm run build
```

To generate a packaged extension:
```
npm run dist
```

Licence
-------

This extension is released under the MIT licence.
