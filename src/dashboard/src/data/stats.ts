/**
 * Measured, not estimated.
 *
 * Every number here comes from `lmucs stats`, which counts lines in tracked
 * files under src/courses by extension and ignores lockfiles. Re-run it
 * rather than editing these by hand; tests/site-data.test.mjs checks the
 * totals against a fresh count and fails when they drift.
 *
 * Last counted 2026-08-22.
 */
export type LanguageCount = { name: string; lines: number };

export const languages: LanguageCount[] = [
  { name: 'JavaScript', lines: 5542 },
  { name: 'Java',       lines: 4427 },
  { name: 'CSS',        lines: 1786 },
  { name: 'Rust',       lines: 743 },
  { name: 'Python',     lines: 554 },
  { name: 'HTML',       lines: 438 },
  { name: 'C',          lines: 355 },
  { name: 'TypeScript', lines: 322 },
  { name: 'Swift',      lines: 318 },
  { name: 'Kotlin',     lines: 268 },
  { name: 'Lua',        lines: 248 },
  { name: 'OCaml',      lines: 204 },
  { name: 'Ohm',        lines: 181 },
  { name: 'Haskell',    lines: 170 },
  { name: 'Go',         lines: 135 },
  { name: 'C++',        lines: 116 },
  { name: 'CloudScribe', lines: 113 },
  { name: 'Assembly',   lines: 30 },
];

export const totalLines = languages.reduce((n, l) => n + l.lines, 0);

/** The headline figures. Each one is checked by a test. */
export const figures = [
  { value: '15', label: 'courses', note: 'Fall 2021 – Spring 2025' },
  { value: '18', label: 'languages', note: 'everything with a line count, including HTML, CSS and assembly' },
  { value: totalLines.toLocaleString('en-US'), label: 'lines of coursework', note: 'tracked files under src/courses' },
  { value: '143', label: 'tests in CloudScribe', note: '99.66% coverage, and still two defects in the back end' },
] as const;
