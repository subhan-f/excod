import { globby } from 'globby';
import { EXCLUDED_GLOB_PATTERNS } from './utils.js';

export async function scanDirectory(dir: string): Promise<string[]> {
  return globby('**/*', {
    cwd: dir,
    gitignore: true,
    dot: false,
    ignore: EXCLUDED_GLOB_PATTERNS,
    onlyFiles: true,
  });
}
