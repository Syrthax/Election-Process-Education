import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// When deployed to GitHub Pages at https://<user>.github.io/<repo>/, the app
// must be served from `/Election-Process-Education/`. Locally `npm run dev`
// uses the default `/` base.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/Election-Process-Education/' : '/',
  plugins: [
    react(),
    tailwindcss(),
  ],
}))
