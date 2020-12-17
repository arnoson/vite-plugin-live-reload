import esbuild from 'rollup-plugin-esbuild'
import dts from 'rollup-plugin-dts'

const bundle = format => ({
  input: 'src/index.ts',
  output: {
    file: `dist/index.${format == 'dts' ? 'd.ts' : 'js'}`,
    format: format == 'dts' ? 'esm' : 'cjs',
    exports: 'named',
    sourcemap: format != 'dts',
    sourcemapExcludeSources: true,
  },
  plugins: format == 'dts' ? [dts()] : [esbuild({ target: 'es2018' })],
  external: id => !/^[./]/.test(id),
})

export default [
  bundle('cjs'),
  bundle('dts'),
]