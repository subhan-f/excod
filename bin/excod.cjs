#!/usr/bin/env node
import('../dist/cli.js').catch((error) => {
  const missingBuiltCli =
    error?.code === 'ERR_MODULE_NOT_FOUND' &&
    typeof error?.message === 'string' &&
    /[\\/]dist[\\/]cli\.js/.test(error.message);

  if (missingBuiltCli) {
    console.error('Error: dist/cli.js not found. Run `npm run build` first.');
    console.error(error.message);
  } else {
    console.error('Error: CLI startup failed.');
    console.error(error?.stack ?? error);
  }
  process.exit(1);
});
