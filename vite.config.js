import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const page = (file) => fileURLToPath(new URL(file, import.meta.url))

export default defineConfig({
  // Relative base works both on the custom domain and on <owner>.github.io/<repo>/.
  base: './',
  build: {
    rolldownOptions: {
      input: {
        index: page('./index.html'),
        impressum: page('./impressum.html'),
        datenschutz: page('./datenschutz.html'),
      },
    },
  },
})
