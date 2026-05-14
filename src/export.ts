import { writeFileSync } from 'fs';

export interface ExportData {
  files: string[];
}

export function exportToJson(files: string[], outputPath?: string): void {
  const data: ExportData = { files };
  const json = JSON.stringify(data, null, 2);
  if (outputPath) {
    writeFileSync(outputPath, json);
    console.log(`Exported to ${outputPath}`);
  } else {
    console.log(json);
  }
}

// TODO: add clipboard export
