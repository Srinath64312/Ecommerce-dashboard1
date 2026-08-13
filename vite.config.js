import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/*
 * GitHub Pages cannot serve custom response headers, so the production build
 * carries its Content-Security-Policy as a <meta> tag. It is injected only for
 * builds because the dev server relies on inline react-refresh scripts.
 */
const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' https: data:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'none'",
  "frame-ancestors 'none'",
].join('; ')

function cspPlugin() {
  return {
    name: 'inject-csp-meta',
    apply: 'build',
    transformIndexHtml(html) {
      return html.replace(
        '<head>',
        `<head>\n    <meta http-equiv="Content-Security-Policy" content="${CSP}" />`
      )
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: '/Ecommerce-dashboard1/',
  build: {
    outDir: 'docs'
  },
  plugins: [react(), cspPlugin()],
})
