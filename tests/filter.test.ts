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
      'a.java', 'a.kt', 'a.aidl', 'a.c', 'a.cpp', 'a.h', 'a.hpp', 'a.cs',
      'a.gradle', 'a.kts', 'a.pro',
      'a.json', 'a.yaml', 'a.yml', 'a.toml', 'a.properties',
      'a.md', 'a.txt', 'a.css', 'a.scss', 'a.html', 'a.xml',
      'a.vue', 'a.svelte',
    ];
    expect(filterFiles(files)).toHaveLength(files.length);
  });

  it('keeps Android source, build, and resource files', () => {
    const files = [
      'app/src/main/java/com/example/MainActivity.java',
      'app/src/main/java/com/example/MainActivity.kt',
      'app/build.gradle.kts',
      'settings.gradle',
      'gradle.properties',
      'app/src/main/AndroidManifest.xml',
    ];

    expect(filterFiles(files)).toEqual(files);
  });

  it('returns empty array for empty input', () => {
    expect(filterFiles([])).toEqual([]);
  });
});
