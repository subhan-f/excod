#!/usr/bin/env node

import { scanDirectory } from './scan.js';
import { filterFiles } from './filter.js';
import { exportToJson } from './export.js';
import { resolvePath } from './utils.js';

function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error('Usage: excod <directory> [output.json]');
    process.exit(1);
  }
  const dir = args[0] as string;
  const output = args[1];
  const fullDir = resolvePath(dir);
  console.log(`Scanning ${fullDir}...`);
  const allFiles = scanDirectory(fullDir);
  console.log(`Found ${allFiles.length} files`);
  const importantFiles = filterFiles(allFiles);
  console.log(`Filtered to ${importantFiles.length} important files`);
  exportToJson(importantFiles, output);
}

main();
