import { Plugin, ViteDevServer } from 'vite'
import chokidar, { WatchOptions } from 'chokidar'
import chalk from 'chalk'
import path from 'path'

// https://github.com/vitejs/vite/blob/03b323d39cafe2baabef74e6051a9640add82590/packages/vite/src/node/server/hmr.ts
function getShortName(file: string, root: string) {
  return file.startsWith(root + '/') ? path.posix.relative(root, file) : file
}

/** Plugin configuration */
interface Config extends WatchOptions {
  /**
   * Whether the page should be reloaded regardless of which file is modified.
   * @default false
   */
  alwaysReload?: boolean

  log?: boolean

  /**
    * File paths will be resolved against this directory.
    *
    * @default ViteDevServer.root
    * @internal
    */
  root?: string
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

  configureServer({ ws, config: { root: viteRoot, logger } }: ViteDevServer) {
    const root = config.root || viteRoot

    const reload = (path: string) => {
      ws.send({ type: 'full-reload', path: config.alwaysReload ? '*' : path })
      if (config.log ?? true) {
        logger.info(
          chalk.green(`page reload `) + chalk.dim(getShortName(path, root)),
          { clear: true, timestamp: true }
        )
      }
    }

    chokidar
      .watch(paths, { cwd: root, ignoreInitial: true, ...config })
      .on('add', reload)
      .on('change', reload)
  }
})
