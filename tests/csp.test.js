import { describe, expect, it } from 'vitest';
import config, { CSP_CONTENT, cspPlugin } from '../vite.config.js';

describe('CSP produksi', () => {
  it('hanya dipasang saat build, bukan saat dev/test', () => {
    expect(config.plugins).toContain(cspPlugin);
    expect(cspPlugin.apply).toBe('build');
  });

  it('menyuntik meta CSP dengan direktif wajib ke dalam head', () => {
    const html = cspPlugin.transformIndexHtml('<!doctype html><html><head></head><body></body></html>');

    expect(html).toContain('http-equiv="Content-Security-Policy"');
    expect(html).toContain(CSP_CONTENT);
    for (const directive of [
      "default-src 'self'",
      "script-src 'self'",
      "style-src 'self'",
      "img-src 'self' data:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ]) {
      expect(CSP_CONTENT).toContain(directive);
    }
  });

  it('tidak memakai frame-ancestors yang tidak didukung meta CSP', () => {
    expect(CSP_CONTENT).not.toContain('frame-ancestors');
  });
});
