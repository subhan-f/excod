import { readdirSync, statSync } from 'fs';
import { join } from 'path';

export function scanDirectory(dir: string): string[] {
  const files: string[] = [];

  function scan(currentDir: string) {
    try {
      const items = readdirSync(currentDir);
      for (const item of items) {
        const fullPath = join(currentDir, item);
        const stat = statSync(fullPath);
        if (stat.isDirectory() && !item.startsWith('.')) {
          // skip hidden dirs
          scan(fullPath);
        } else if (stat.isFile()) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      // ignore errors, like permission denied
    }
  }

  scan(dir);
  return files;
}
