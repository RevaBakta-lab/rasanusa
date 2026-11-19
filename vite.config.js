import { defineConfig } from 'vite';

/**
 * CSP untuk produksi saja. Meta CSP tidak bisa memuat `frame-ancestors`;
 * direktif tersebut harus ditetapkan sebagai header oleh host jika diperlukan.
 */
export const CSP_CONTENT = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self'",
  "img-src 'self' data:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ');

export const cspPlugin = {
  name: 'washly-production-csp',
  apply: 'build',
  transformIndexHtml(html) {
    const meta = `<meta http-equiv="Content-Security-Policy" content="${CSP_CONTENT}" />`;
    return html.replace('<head>', `<head>\n    ${meta}`);
  },
};

export default defineConfig({
  plugins: [cspPlugin],
});
