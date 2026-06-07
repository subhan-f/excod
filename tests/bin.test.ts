import { describe, expect, it } from 'vitest';
import { spawnSync } from 'node:child_process';
import { copyFileSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

describe('bin/excod.cjs', () => {
  it('explains how to recover when dist/cli.js is missing', () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'excod-bin-missing-dist-'));
    const tempBin = join(tempDir, 'bin', 'excod.cjs');
    mkdirSync(dirname(tempBin), { recursive: true });
    copyFileSync('bin/excod.cjs', tempBin);

    try {
      const result = spawnSync(process.execPath, [tempBin], {
        cwd: tempDir,
        encoding: 'utf8',
      });

      expect(result.status).toBe(1);
      expect(result.stderr).toContain('Run `npm run build` first');
      expect(result.stderr).toContain('dist/cli.js');
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('does not report missing dist for CLI runtime failures', () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'excod-bin-runtime-error-'));
    const tempBin = join(tempDir, 'bin', 'excod.cjs');
    const tempCli = join(tempDir, 'dist', 'cli.js');
    mkdirSync(dirname(tempBin), { recursive: true });
    mkdirSync(dirname(tempCli), { recursive: true });
    copyFileSync('bin/excod.cjs', tempBin);
    writeFileSync(tempCli, "throw new Error('boom from cli');\n", 'utf8');

    try {
      const result = spawnSync(process.execPath, [tempBin], {
        cwd: tempDir,
        encoding: 'utf8',
      });

      expect(result.status).toBe(1);
      expect(result.stderr).toContain('CLI startup failed');
      expect(result.stderr).toContain('boom from cli');
      expect(result.stderr).not.toContain('Run `npm run build` first');
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });
});
