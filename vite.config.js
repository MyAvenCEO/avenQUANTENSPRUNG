import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const page = (file) => fileURLToPath(new URL(file, import.meta.url))

export default defineConfig({
  // Relative base works both on the custom domain and on <owner>.github.io/<repo>/.
  base: './',
  // Der Harness weist den Port über PORT zu; Vite liest ihn nicht von selbst.
  server: { port: Number(process.env.PORT) || 5173 },
  build: {
    rolldownOptions: {
      input: {
        index: page('./index.html'),
        retreat: page('./retreat.html'),
        koerpertraining: page('./koerpertraining.html'),
        impressum: page('./impressum.html'),
        datenschutz: page('./datenschutz.html'),
        widerruf: page('./widerruf.html'),
      },
    },
  },
})
