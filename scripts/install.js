#!/usr/bin/env node
/**
 * Universal installer for excod.
 *
 * Downloads the correct pre-built binary from GitHub Releases and places it
 * in a directory on your PATH. Works on macOS, Linux, and Windows without
 * requiring Node.js to be installed afterwards.
 *
 * Usage:
 *   node scripts/install.js
 *
 * Or pipe directly from the web:
 *   curl -fsSL https://raw.githubusercontent.com/subhan-f/excod/main/scripts/install.js | node
 *
 * Environment variables:
 *   EXCOD_VERSION   — override the version to install (default: latest release)
 *   EXCOD_INSTALL   — override the install directory
 */

import { createWriteStream, chmodSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { pipeline } from 'stream/promises';
import https from 'https';
import os from 'os';
import { execSync } from 'child_process';

const REPO = 'subhan-f/excod';

// ─── helpers ──────────────────────────────────────────────────────────────────

function getBinaryName() {
  const platform = os.platform();
  const arch = os.arch();
  const archTag = arch === 'arm64' ? 'arm64' : 'x64';

  if (platform === 'darwin') return `excod-macos-${archTag}`;
  if (platform === 'linux') return `excod-linux-${archTag}`;
  if (platform === 'win32') return 'excod-win.exe';

  throw new Error(`Unsupported platform: ${platform} (${arch})`);
}

function getDefaultInstallDir() {
  if (process.platform === 'win32') {
    const localAppData = process.env['LOCALAPPDATA'];
    return localAppData
      ? join(localAppData, 'Programs', 'excod')
      : join(os.homedir(), 'AppData', 'Local', 'Programs', 'excod');
  }
  // Prefer /usr/local/bin when writable (system-wide), else ~/.local/bin (user).
  try {
    execSync('test -w /usr/local/bin', { stdio: 'ignore' });
    return '/usr/local/bin';
  } catch {
    return join(os.homedir(), '.local', 'bin');
  }
}

function followRedirects(url, redirectsLeft = 5) {
  return new Promise((resolve, reject) => {
    if (redirectsLeft === 0) return reject(new Error('Too many redirects'));
    https
      .get(url, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          const location = res.headers['location'];
          if (!location) return reject(new Error('Redirect with no Location header'));
          res.resume();
          resolve(followRedirects(location, redirectsLeft - 1));
        } else if (res.statusCode === 200) {
          resolve(res);
        } else {
          reject(new Error(`HTTP ${res.statusCode} fetching ${url}`));
        }
      })
      .on('error', reject);
  });
}

async function fetchLatestVersion() {
  const url = `https://api.github.com/repos/${REPO}/releases/latest`;
  const res = await followRedirects(url);
  const chunks = [];
  for await (const chunk of res) chunks.push(chunk);
  const body = JSON.parse(Buffer.concat(chunks).toString('utf8'));
  return body.tag_name.replace(/^v/, '');
}

async function downloadBinary(url, dest) {
  const res = await followRedirects(url);
  const file = createWriteStream(dest);
  await pipeline(res, file);
}

// ─── main ─────────────────────────────────────────────────────────────────────

async function main() {
  const version = process.env['EXCOD_VERSION'] ?? (await fetchLatestVersion());
  const binaryName = getBinaryName();
  const installDir = process.env['EXCOD_INSTALL'] ?? getDefaultInstallDir();
  const installName = process.platform === 'win32' ? 'excod.exe' : 'excod';
  const dest = join(installDir, installName);
  const url = `https://github.com/${REPO}/releases/download/v${version}/${binaryName}`;

  console.log(`Installing excod v${version}`);
  console.log(`  Platform : ${os.platform()}/${os.arch()}`);
  console.log(`  Binary   : ${binaryName}`);
  console.log(`  From     : ${url}`);
  console.log(`  To       : ${dest}\n`);

  if (!existsSync(installDir)) {
    mkdirSync(installDir, { recursive: true });
  }

  await downloadBinary(url, dest);

  if (process.platform !== 'win32') {
    chmodSync(dest, 0o755);
  }

  console.log('excod installed successfully!');
  console.log(`Run: excod --help\n`);

  // Warn if the install directory is not on PATH.
  const separator = process.platform === 'win32' ? ';' : ':';
  const pathDirs = (process.env['PATH'] ?? '').split(separator);
  if (!pathDirs.includes(installDir)) {
    console.warn(`Note: ${installDir} is not in your PATH.`);
    if (process.platform === 'win32') {
      console.warn(`Add it via: System Properties → Environment Variables → PATH`);
    } else {
      console.warn(`Add this to your shell profile (~/.zshrc, ~/.bashrc, etc.):`);
      console.warn(`  export PATH="$PATH:${installDir}"`);
    }
  }
}

main().catch((err) => {
  console.error(`\nInstallation failed: ${err.message}`);
  process.exit(1);
});
