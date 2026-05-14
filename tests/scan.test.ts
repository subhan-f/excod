import { describe, it, expect } from 'vitest';
import { statSync } from 'fs';
import { join } from 'path';
import { scanDirectory } from '../src/scan.js';

describe('scanDirectory', () => {
  it('returns an array of files', async () => {
    const files = await scanDirectory('.');
    expect(Array.isArray(files)).toBe(true);
    expect(files.length).toBeGreaterThan(0);
  });

  it('excludes node_modules', async () => {
    const files = await scanDirectory('.');
    expect(files.every((f) => !f.includes('node_modules'))).toBe(true);
  });

  it('returns relative paths', async () => {
    const files = await scanDirectory('.');
    expect(files.every((f) => !f.startsWith('/'))).toBe(true);
  });

  it('only returns files, not directories', async () => {
    const files = await scanDirectory('.');
    expect(files.every((f) => statSync(join('.', f)).isFile())).toBe(true);
  });
});
