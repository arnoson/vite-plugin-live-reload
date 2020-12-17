# vite-plugin-live-reload
A *very* simple live reloading plugin for [vite](https://github.com/vitejs/vite).

# Example
I use this configuration when working with [Kirby CMS](https://getkirby.com/) (assuming your Kirby site is inside a `public` folder).

Note: the paths you are watching are relative to vite's root folder.
```js
// vite.config.js
import liveReload from 'vite-plugin-live-reload'

export default {
  // ...
  plugins: [
    liveReload('public/site/(templates|snippets|controllers|models)/**/*.php'),
  ]
}
```