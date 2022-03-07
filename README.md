# vite-plugin-live-reload
A simple live reloading plugin for [vite](https://github.com/vitejs/vite).

## Example
I use this configuration when working with [Kirby CMS](https://getkirby.com/), but it works great with any backend!

Note: by default the paths are relative to Vite's root folder.
```js
// vite.config.js
import liveReload from 'vite-plugin-live-reload'

export default {
  // ...
  plugins: [
    liveReload('../site/(templates|snippets|controllers|models)/**/*.php'),
  ]
}
```

## Usage

Watch one or more paths:

```js
liveReload('my/path/**/*.php')
```

```js
liveReload(['my/path/**/*.php', 'my/other/path/**/*.php'])
```

The plugin uses a [chokidar](https://github.com/paulmillr/chokidar) watcher. See the chokidar documentation to find out which path notations are supported.

## Options

### Root

By default Vite's root directory is used, but you can specify your own directory:

```js
liveReload('my-file', { root: process.cwd() })
```

### Always reload

If the modified file is an `.html` file, Vite's client only reloads the page if the browser is currently on this HTML page. With `alwaysReload` the browser is reloaded anyway.

```js
liveReload('my-file', { alwaysReload: true })
```