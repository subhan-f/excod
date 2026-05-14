import { describe, it, expect } from 'vitest';
import { filterFiles } from '../src/filter.js';

describe('filterFiles', () => {
  it('keeps important extensions', () => {
    const files = ['a.ts', 'b.js', 'c.py', 'd.json', 'e.md'];
    expect(filterFiles(files)).toEqual(['a.ts', 'b.js', 'c.py', 'd.json', 'e.md']);
  });

  it('removes unimportant extensions', () => {
    const files = ['image.png', 'archive.zip', 'binary.exe', 'data.db'];
    expect(filterFiles(files)).toEqual([]);
  });

  it('handles mixed files', () => {
    const files = ['a.ts', 'b.png', 'c.txt', 'd.db'];
    expect(filterFiles(files)).toEqual(['a.ts', 'c.txt']);
  });

  it('handles all spec-listed extensions', () => {
    const files = [
      'a.ts', 'a.tsx', 'a.js', 'a.jsx',
      'a.py', 'a.rb', 'a.go', 'a.rs',
      'a.java', 'a.c', 'a.cpp', 'a.h', 'a.hpp', 'a.cs',
      'a.json', 'a.yaml', 'a.yml', 'a.toml',
      'a.md', 'a.txt', 'a.css', 'a.scss', 'a.html',
      'a.vue', 'a.svelte',
    ];
    expect(filterFiles(files)).toHaveLength(files.length);
  });

  it('returns empty array for empty input', () => {
    expect(filterFiles([])).toEqual([]);
  });
});
