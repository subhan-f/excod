import { writeFileSync, readFileSync } from 'fs';
import { join } from 'path';
import clipboard from 'clipboardy';

export type ExportData = Record<string, string>;

export interface ExportOptions {
  output?: string;
  clipboard?: boolean;
}

export function buildExportData(filePaths: string[], baseDir = '.'): ExportData {
  const data: ExportData = {};
  for (const filePath of filePaths) {
    data[filePath] = readFileSync(join(baseDir, filePath), 'utf8');
  }
  return data;
}

export async function exportResults(data: ExportData, options: ExportOptions): Promise<void> {
  const json = JSON.stringify(data, null, 2);
  const count = Object.keys(data).length;

  if (options.output != null) {
    writeFileSync(options.output, json, 'utf8');
    console.log(`Wrote ${count} file entries to ${options.output}`);
  } else if (options.clipboard === true) {
    await clipboard.write(json);
    console.log(`Copied ${count} file entries to clipboard`);
  } else {
    process.stdout.write(json + '\n');
  }
}
