/**
 * Measured, not estimated.
 *
 * Every number here comes from `lmucs stats`, which counts lines in tracked
 * files under src/courses by extension and ignores lockfiles. Re-run it
 * rather than editing these by hand; tests/site-data.test.mjs checks the
 * totals against a fresh count and fails when they drift.
 *
 * Last counted 2026-11-11.
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

/**
 * The same count split by course directory, from the `by_course` key of
 * `lmucs stats --json`. Courses with no counted code are absent. The language
 * by course matrix in README.md and docs/course-map.md is generated from this
 * by scripts/course-map.mjs, and a test checks it against a fresh count.
 */
export type CourseLines = { course: string; languages: LanguageCount[] };

export const linesByCourse: CourseLines[] = [
  { course: 'CMSI 2021', languages: [{ name: 'JavaScript', lines: 911 }, { name: 'CSS', lines: 188 }, { name: 'HTML', lines: 153 }] },
  { course: 'CMSI 2130', languages: [{ name: 'Java', lines: 4079 }] },
  { course: 'CMSI 3300', languages: [{ name: 'Python', lines: 335 }] },
  { course: 'CMSI 3550', languages: [{ name: 'Rust', lines: 663 }, { name: 'JavaScript', lines: 253 }, { name: 'CSS', lines: 120 }, { name: 'HTML', lines: 60 }] },
  { course: 'CMSI 3801', languages: [{ name: 'C', lines: 355 }, { name: 'Java', lines: 348 }, { name: 'TypeScript', lines: 322 }, { name: 'Swift', lines: 318 }, { name: 'JavaScript', lines: 282 }, { name: 'Kotlin', lines: 268 }, { name: 'Lua', lines: 248 }, { name: 'Python', lines: 219 }, { name: 'OCaml', lines: 204 }, { name: 'Haskell', lines: 170 }, { name: 'Go', lines: 135 }, { name: 'C++', lines: 116 }, { name: 'Rust', lines: 80 }] },
  { course: 'CMSI 3802', languages: [{ name: 'JavaScript', lines: 2418 }, { name: 'CSS', lines: 213 }, { name: 'Ohm', lines: 181 }, { name: 'HTML', lines: 170 }, { name: 'CloudScribe', lines: 113 }, { name: 'Assembly', lines: 30 }] },
  { course: 'CMSI 4072', languages: [{ name: 'JavaScript', lines: 1678 }, { name: 'CSS', lines: 1265 }, { name: 'HTML', lines: 55 }] },
];

export const totalLines = languages.reduce((n, l) => n + l.lines, 0);

/** The headline figures. Each one is checked by a test. */
export const figures = [
  { value: '15', label: 'courses', note: 'Fall 2021 – Spring 2025' },
  { value: '18', label: 'languages', note: 'everything with a line count, including HTML, CSS and assembly' },
  { value: totalLines.toLocaleString('en-US'), label: 'lines of coursework', note: 'tracked files under src/courses' },
  { value: '143', label: 'tests in CloudScribe', note: '99.66% coverage, and still two defects in the back end' },
] as const;

/**
 * What checks this repository, in numbers. Each one is counted by a test:
 * the two test counts from the test files themselves, the suite count from
 * the table in docs/building.md, the runner list from the workflow.
 */
export const checks = {
  siteDataTests: 36,
  lmucsTests: 24,
  suitesRun: 9,
  suitesDate: '2026-11-11',
  cloudscribeTests: 143,
  ciRunners: ['ubuntu-latest', 'macos-latest'],
} as const;
