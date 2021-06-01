[![Build Status](https://secure.travis-ci.org/joelpurra/bespoke-analytics.png?branch=master)](https://travis-ci.org/joelpurra/bespoke-analytics) [![Coverage Status](https://coveralls.io/repos/joelpurra/bespoke-analytics/badge.png)](https://coveralls.io/r/joelpurra/bespoke-analytics)

# [bespoke-analytics](https://github.com/joelpurra/bespoke-analytics)

**Check out the [presentation/demo.](https://joelpurra.github.io/bespoke-analytics/demo/)**

Visitor analysis per slide in your [Bespoke.js][bespoke.js] presentation



> ## ⚠️ This project has been archived
>
> No future updates are planned. Feel free to continue using it, but expect no support.



## Download

Download the [production version][min] or the [development version][max], or use a [package manager](#package-managers).

[min]: https://raw.github.com/joelpurra/bespoke-analytics/master/dist/bespoke-analytics.min.js
[max]: https://raw.github.com/joelpurra/bespoke-analytics/master/dist/bespoke-analytics.js

## Usage

This plugin is shipped in a [UMD format](https://github.com/umdjs/umd), meaning that it is available as a CommonJS/AMD module or browser global.

For example, when using CommonJS modules:

```js
// You choose either bespoke-hash or bespoke-history.
var bespoke = require('bespoke'),
  // hash = require('bespoke-hash'),
  // history = require('bespoke-history'),
  ga = require('bespoke-ga');
  analytics = require('bespoke-analytics');

bespoke.from('#presentation', [
  // hash(),
  // history(),
  ga({
    trackingId: '' // A string like 'UA-12345678-9'
  }),
  analytics()
]);
```

When using browser globals:

```js
// You choose either bespoke-hash or bespoke-history.
bespoke.from('#presentation', [
  //bespoke.plugins.hash(),
  //bespoke.plugins.history(),
  bespoke.plugins.ga({
    trackingId: '' // A string like 'UA-12345678-9'
  }),
  bespoke.plugins.analytics()
]);
```

## Package managers

### npm

```bash
$ npm install bespoke-analytics
```

### Bower

```bash
$ bower install bespoke-analytics
```

## Credits

[Mark Dalgleish](https://markdalgleish.com/) for [bespoke.js][bespoke.js] and related tools. This plugin was built with [generator-bespokeplugin](https://github.com/markdalgleish/generator-bespokeplugin).

Thanks [Hans](https://pixabay.com/en/users/Hans-2/) for the [Snow Traces Footprints White](https://pixabay.com/en/snow-traces-footprints-white-81338/) (CC0 license) image!

My best friend, [bespoke-convenient](https://github.com/joelpurra/bespoke-convenient), for continued support - rain and shine. I love you, man.


## License

Copyright (c) 2015, [Joel Purra](https://joelpurra.com/) All rights reserved.

When using bespoke-analytics, comply to the [MIT license](https://joelpurra.mit-license.org/2015). Please see the LICENSE file for details, and the [MIT License on Wikipedia](https://en.wikipedia.org/wiki/MIT_License).

[bespoke.js]: https://github.com/markdalgleish/bespoke.js
[default-events]: https://github.com/markdalgleish/bespoke.js#events
