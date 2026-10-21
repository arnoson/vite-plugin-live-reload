import { Plugin, ViteDevServer } from 'vite'
import picomatch from 'picomatch'
import colors from 'picocolors'
import path from 'path'

const toPosix = (file: string) => file.split(path.sep).join('/')

// https://github.com/vitejs/vite/blob/03b323d39cafe2baabef74e6051a9640add82590/packages/vite/src/node/server/hmr.ts
function getShortName(file: string, root: string) {
  return file.startsWith(root + '/') ? path.posix.relative(root, file) : file
}

/** Plugin configuration */
export interface Config {
  /**
   * Whether the page should be reloaded regardless of which file is modified.
   * @default false
   */
  alwaysReload?: boolean

  /**
   * Whether to log when a file change triggered a live reload
   * @default true
   */
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
export const liveReload = (
  paths: string | string[],
  config: Config = {}
): Plugin => ({
  name: 'vite-plugin-live-reload',

  configureServer({
    ws,
    watcher,
    config: { root: viteRoot, logger }
  }: ViteDevServer) {
    const root = config.root || viteRoot

    const patterns = [paths].flat().map((pattern) => {
      const absolute = toPosix(path.resolve(root, pattern))
      const { base, isGlob } = picomatch.scan(absolute)
      // Plain paths match the file itself or anything inside a directory.
      const isMatch = isGlob
        ? picomatch(absolute, { dot: true })
        : (file: string) => file === base || file.startsWith(base + '/')
      return { base, isMatch }
    })

    watcher.add(patterns.map(({ base }) => base))

    const onFileEvent = (file: string) => {
      const normalized = toPosix(file)
      if (patterns.some(({ isMatch }) => isMatch(normalized))) reload(file)
    }

    const reload = (path: string) => {
      ws.send({ type: 'full-reload', path: config.alwaysReload ? '*' : path })
      if (config.log ?? true) {
        logger.info(
          colors.green(`page reload `) + colors.dim(getShortName(path, root)),
          { clear: true, timestamp: true }
        )
      }
    }

    watcher.on('add', onFileEvent).on('change', onFileEvent)
  }
})

export default liveReload