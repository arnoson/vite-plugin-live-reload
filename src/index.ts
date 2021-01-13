import { Plugin, ViteDevServer } from 'vite'
import chokidar, { WatchOptions } from 'chokidar'
import chalk from 'chalk'

/** Plugin configuration */
interface Config extends WatchOptions {
  log?: boolean
}

/**
 * Reload all connected clients if one of the watched files changes or a new
 * file is added to a watched directory. This is useful when you are working
 * with a traditional backend and want to trigger page reloads when you are
 * changing for example php files.
 */
export default (
  paths: string | readonly string[],
  config: Config = {}
): Plugin => ({
  name: 'vite-plugin-live-reload',

  configureServer({ ws, config: { root } }: ViteDevServer) {
    const reload = (path: string, action: string) => {
      ws.send({ type: 'full-reload', path })
      if (config.log ?? true) {
        console.log(chalk.green(`[vite-live-reload] `) + `${path} ${action}.`)
      }
    }
    chokidar
      .watch(paths, { cwd: root, ignoreInitial: true, ...config })
      .on('add', path => reload(path, 'added'))
      .on('change', path => reload(path, 'changed'))
    }
})