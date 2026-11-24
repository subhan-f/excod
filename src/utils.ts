import { resolve, relative, extname } from 'path';

export const IMPORTANT_EXTENSIONS = new Set<string>([
  '.ts', '.tsx', '.js', '.jsx',
  '.py', '.rb', '.go', '.rs',
  '.java', '.kt', '.aidl', '.c', '.cpp', '.h', '.hpp', '.cs',
  '.gradle', '.kts', '.pro',
  '.json', '.yaml', '.yml', '.toml', '.properties',
  '.md', '.txt',
  '.css', '.scss', '.html', '.xml',
  '.vue', '.svelte',
]);

export const EXCLUDED_GLOB_PATTERNS: string[] = [
  'node_modules/**',
  '.git/**',
  'dist/**',
  'build/**',
  '__pycache__/**',
];

export function resolvePath(inputPath: string): string {
  return resolve(inputPath);
}

export function toRelativePath(basePath: string, filePath: string): string {
  return relative(basePath, filePath);
}

export function hasImportantExtension(filePath: string): boolean {
  return IMPORTANT_EXTENSIONS.has(extname(filePath));
}
