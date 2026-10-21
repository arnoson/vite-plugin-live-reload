import { defineConfig } from 'vite'
import liveReload from '../src/index.ts'

export default defineConfig({
  plugins: [
    liveReload(
      ['backend/**/*.php', 'templates'], 
      { alwaysReload: true }
    )
  ]
})
