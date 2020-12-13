import chokidar from 'chokidar'
import chalk from 'chalk'

/**
 * Reload all connected clients if one of the watched files changes or a new
 * file is added to a watched directory. This is useful when you are working
 * with a traditional backend and want to trigger page reloads when you are
 * changing for example php files.
 */
export default (paths, { log = true } = {}) => ({
  configureServer: [
    ({ watcher }) => {
      const reload = (path, action) => {
        // We utilize the `send()` method of the `watcher` instance. I'm not
        // sure if this is the correct way to send messages to the client but it
        // works great.
        watcher.send({ type: 'full-reload', path })
        if (log) {
          console.log(chalk.green(`[vite-live-reload] `) + `${path} ${action}.`)
        }
      }
      chokidar
        .watch(paths, { ignoreInitial: true })
        .on('add', path => reload(path, 'added'))
        .on('change', path => reload(path, 'changed'))
    }
  ]
})
