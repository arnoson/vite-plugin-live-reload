import esbuild from 'rollup-plugin-esbuild'

export default {
  input: 'src/index.js',
  output: {
    dir: 'dist',
    format: 'cjs',
    exports: 'named'
  },
  plugins: [esbuild({ target: 'es2018' })],
  external: id => !/^[./]/.test(id),
}