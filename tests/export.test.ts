import { describe, it, expect, vi } from 'vitest';
import { buildExportData, exportResults } from '../src/export.js';
import type { ExportData } from '../src/export.js';
import { writeFileSync } from 'fs';

vi.mock('fs', () => ({
  writeFileSync: vi.fn(),
  readFileSync: vi.fn().mockReturnValue('mock content'),
}));
vi.mock('clipboardy', () => ({
  default: { write: vi.fn().mockResolvedValue(undefined) },
}));

describe('buildExportData', () => {
  it('returns a flat path→content object', () => {
    const data = buildExportData(['src/index.ts', 'README.md']);
    expect(data).toEqual({
      'src/index.ts': 'mock content',
      'README.md': 'mock content',
    });
  });

  it('reads file content for each path', () => {
    const data = buildExportData(['a.ts']);
    expect(data['a.ts']).toBe('mock content');
  });

  it('handles empty input', () => {
    expect(buildExportData([])).toEqual({});
  });
});

describe('exportResults', () => {
  it('writes to stdout when no options given', async () => {
    const writeSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
    const data: ExportData = { 'a.ts': 'content' };
    await exportResults(data, {});
    expect(writeSpy).toHaveBeenCalledWith(expect.stringContaining('a.ts'));
    writeSpy.mockRestore();
  });

  it('writes to file when output option provided', async () => {
    const data: ExportData = { 'a.ts': 'content' };
    await exportResults(data, { output: 'out.json' });
    expect(writeFileSync).toHaveBeenCalledWith(
      'out.json',
      expect.stringContaining('a.ts'),
      'utf8',
    );
  });

  it('outputs valid JSON with flat structure', async () => {
    let captured = '';
    vi.spyOn(process.stdout, 'write').mockImplementation((chunk) => {
      captured += chunk;
      return true;
    });
    const data: ExportData = { 'src/a.ts': 'hello' };
    await exportResults(data, {});
    const parsed = JSON.parse(captured) as ExportData;
    expect(parsed['src/a.ts']).toBe('hello');
    vi.restoreAllMocks();
  });
});
