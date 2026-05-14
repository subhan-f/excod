# excod

A CLI tool that scans a codebase, identifies the important source and configuration files, and exports their paths as structured JSON — to stdout, a file, or your clipboard.

## Installation

```bash
npm install -g excod
```

## Usage

```bash
# Scan current directory, print JSON to terminal
excod

# Scan a specific path
excod ~/projects/my-app

# Write JSON to a file
excod . -o important.json

# Copy JSON directly to clipboard
excod ./src --clipboard

# Show help
excod --help
```

### Output schema

```json
{
  "files": [
    { "path": "relative/path/to/file.ts", "content": "" }
  ]
}
```

## Options

| Flag | Description |
|------|-------------|
| `[directory]` | Directory to scan (default: `.`) |
| `-o, --output <path>` | Save JSON to a file |
| `-c, --clipboard` | Copy JSON to clipboard |
| `-V, --version` | Print version |
| `-h, --help` | Display help |

## File heuristic

Included extensions: `.ts` `.tsx` `.js` `.jsx` `.py` `.rb` `.go` `.rs` `.java` `.c` `.cpp` `.h` `.hpp` `.cs` `.json` `.yaml` `.yml` `.toml` `.md` `.txt` `.css` `.scss` `.html` `.vue` `.svelte`

Excluded directories: `node_modules`, `.git`, `dist`, `build`, `__pycache__`. Also respects `.gitignore` automatically.

## Development

```bash
npm run build    # compile TypeScript → dist/
npm run dev      # run directly with tsx (no build needed)
npm test         # run Vitest test suite
npm run lint     # ESLint
npm run format   # Prettier
```
