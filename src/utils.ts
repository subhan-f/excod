import { resolve } from 'path';

export function resolvePath(path: string): string {
  return resolve(path);
}

export function isFileImportant(filePath: string): boolean {
  const importantExtensions = ['.ts', '.js', '.json', '.md'];
  return importantExtensions.some((ext) => filePath.endsWith(ext));
}
