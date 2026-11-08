/**
 * Which courses each counted language was written in.
 *
 * Pure on purpose: it takes the data rather than importing it, so
 * tests/site-data.test.mjs can call it under plain Node and check that every
 * language with a line count leads to at least one course.
 *
 * A course counts for a language when any of these says so:
 *   - the course lists it in its stack
 *   - the toolkit entry for it cites the course ("CMSI 2021, 3801")
 *   - a program with that name belongs to the course (CloudScribe is both a
 *     language and the CMSI 3802 program written in it)
 */
type CourseLike = { code: string; stack: readonly string[] };
type ToolLike = { name: string; where: string };
type ProgramLike = { name: string; course: string };
type LanguageCountLike = { name: string; lines: number };

export type LanguageEntry<C extends CourseLike> = { name: string; lines: number; courses: C[] };

/** "CMSI 2021, 3801, 3802" -> ["CMSI 2021", "CMSI 3801", "CMSI 3802"]. */
export const citedCodes = (where: string): string[] =>
  /\bCMSI\b/.test(where) ? [...where.matchAll(/\b\d{4}\b/g)].map((m) => `CMSI ${m[0]}`) : [];

export function languageIndex<C extends CourseLike>(
  languages: readonly LanguageCountLike[],
  courses: readonly C[],
  toolkit: readonly ToolLike[],
  programs: readonly ProgramLike[],
): LanguageEntry<C>[] {
  return languages.map(({ name, lines }) => {
    const codes = new Set<string>();
    for (const c of courses) if (c.stack.includes(name)) codes.add(c.code);
    for (const t of toolkit) if (t.name === name) citedCodes(t.where).forEach((code) => codes.add(code));
    for (const p of programs) if (p.name === name) codes.add(p.course);
    return { name, lines, courses: courses.filter((c) => codes.has(c.code)) };
  });
}
