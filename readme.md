# electron-easy-spellcheck

**Note:** This library is inspired by [electron-spell-check-provider](https://github.com/mixmaxhq/electron-spell-check-provider) and it works pretty much the same. The main difference is that this library tries to solve the issue with input lags by introducing a cache.

## Installation

`yarn add electron-easy-spellcheck`

or

`npm install electron-easy-spellcheck`

## Usage

```
// In the renderer process:
const webFrame = require('electron').webFrame;
const EasySpellCheck = require('electron-easy-spellcheck');

webFrame.setSpellCheckProvider('en-US', true, new EasySpellCheck());
```

### Cache TTL

The cache has a pre-defined TTL, meaning that the cache will be cleared when the user haven't typed anything for the set TTL.

The default TTL is 10 seconds. You can modify this by passing in the desired TTL in the constructor like this `new EasySpellCheck(CACHE_TTL)`.

## Example

Run `yarn start` to start the example application.