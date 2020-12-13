# vite-live-reload
A *very* simple live reloading plugin for [vite](https://github.com/vitejs/vite).

# Example
I use this configuration when working with [Kirby CMS](https://getkirby.com/) (assuming your Kirby site is inside a `public` folder).
```js
// vite.config.js
import viteLiveReload from 'vite-live-reload'

export default {
  // ...
  plugins: [
    viteLiveReload(
      'public/site/(templates|snippets|controllers|models)/**/*.php'
    ),
  ]
}
```