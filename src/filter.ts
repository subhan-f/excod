import { isFileImportant } from './utils.js';

export function filterFiles(files: string[]): string[] {
  return files.filter(isFileImportant);
}
