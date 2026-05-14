import { Command } from 'commander';
import { scanDirectory } from './scan.js';
import { filterFiles } from './filter.js';
import { buildExportData, exportResults } from './export.js';
import { resolvePath } from './utils.js';

interface ActionOptions {
  output?: string;
  clipboard?: boolean;
}

const program = new Command();

program
  .name('excod')
  .description('Scan a codebase, identify important files, and export as JSON')
  .version('1.0.0')
  .argument('[directory]', 'directory to scan', '.')
  .option('-o, --output <path>', 'save JSON to a file')
  .option('-c, --clipboard', 'copy JSON to clipboard')
  .action(async (directory: string, options: ActionOptions) => {
    const resolvedDir = resolvePath(directory);
    const allFiles = await scanDirectory(resolvedDir);
    const filteredFiles = filterFiles(allFiles);
    const data = buildExportData(filteredFiles, resolvedDir);
    await exportResults(data, options);
  });

await program.parseAsync();
