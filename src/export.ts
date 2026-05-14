import { writeFileSync, readFileSync } from 'fs';
import { join } from 'path';
import clipboard from 'clipboardy';

export interface FileEntry {
  path: string;
  content: string;
}

export interface ExportData {
  files: FileEntry[];
}

export interface ExportOptions {
  output?: string;
  clipboard?: boolean;
}

export function buildExportData(filePaths: string[], baseDir: string = '.'): ExportData {
  return {
    files: filePaths.map((path) => ({
      path,
      content: readFileSync(join(baseDir, path), 'utf8'),
    })),
  };
}

export async function exportResults(data: ExportData, options: ExportOptions): Promise<void> {
  const json = JSON.stringify(data, null, 2);

  if (options.output != null) {
    writeFileSync(options.output, json, 'utf8');
    console.log(`Wrote ${data.files.length} file entries to ${options.output}`);
  } else if (options.clipboard === true) {
    await clipboard.write(json);
    console.log(`Copied ${data.files.length} file entries to clipboard`);
  } else {
    process.stdout.write(json + '\n');
  }
}
