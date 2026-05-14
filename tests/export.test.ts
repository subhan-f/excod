import { describe, it, expect, vi } from 'vitest';
import { buildExportData, exportResults } from '../src/export.js';
import type { ExportData } from '../src/export.js';
import { writeFileSync } from 'fs';

vi.mock('fs', () => ({ writeFileSync: vi.fn(), readFileSync: vi.fn().mockReturnValue('mock content') }));
vi.mock('clipboardy', () => ({ default: { write: vi.fn().mockResolvedValue(undefined) } }));

describe('buildExportData', () => {
  it('builds the correct schema', () => {
    const data = buildExportData(['src/index.ts', 'README.md']);
    expect(data.files).toHaveLength(2);
    expect(data.files[0]?.path).toBe('src/index.ts');
    expect(data.files[1]?.path).toBe('README.md');
  });

  it('reads file content', () => {
    const data = buildExportData(['a.ts']);
    expect(data.files[0]?.content).toBe('mock content');
  });

  it('handles empty input', () => {
    const data = buildExportData([]);
    expect(data.files).toEqual([]);
  });
});

describe('exportResults', () => {
  it('writes to stdout when no options given', async () => {
    const writeSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
    const data: ExportData = { files: [{ path: 'a.ts', content: '' }] };
    await exportResults(data, {});
    expect(writeSpy).toHaveBeenCalledWith(expect.stringContaining('a.ts'));
    writeSpy.mockRestore();
  });

  it('writes to file when output option provided', async () => {
    const data: ExportData = { files: [{ path: 'a.ts', content: '' }] };
    await exportResults(data, { output: 'out.json' });
    expect(writeFileSync).toHaveBeenCalledWith('out.json', expect.stringContaining('a.ts'), 'utf8');
  });

  it('outputs valid JSON', async () => {
    let captured = '';
    vi.spyOn(process.stdout, 'write').mockImplementation((chunk) => {
      captured += chunk;
      return true;
    });
    const data: ExportData = { files: [{ path: 'src/a.ts', content: '' }] };
    await exportResults(data, {});
    expect(() => JSON.parse(captured)).not.toThrow();
    const parsed = JSON.parse(captured) as ExportData;
    expect(parsed.files[0]?.path).toBe('src/a.ts');
    vi.restoreAllMocks();
  });
});
