/**
 * Build-time reads out of the repository, for components that quote or embed
 * the coursework instead of copying it.
 *
 * Astro rewrites `import.meta.url` in the built output, so a component cannot
 * resolve paths against its own location — by the time the code runs it lives
 * in dist/.prerender/chunks. Anchor on the repository root instead, found by
 * walking up from the working directory until src/courses appears.
 *
 * Read-only by construction: nothing here writes, and nothing here should.
 * Coursework under src/courses stays exactly as submitted.
 */
import fs from 'node:fs';
import path from 'node:path';

let cached: string | null = null;

export function repoRoot(): string {
  if (cached) return cached;
  let dir = process.cwd();
  for (;;) {
    if (fs.existsSync(path.join(dir, 'src/courses'))) return (cached = dir);
    const up = path.dirname(dir);
    if (up === dir) {
      throw new Error(`repository root not found walking up from ${process.cwd()}`);
    }
    dir = up;
  }
}

const resolve = (relative: string) => path.join(repoRoot(), relative);

/** Read a repository-relative file as UTF-8. Throws if it is missing. */
export function readRepoText(relative: string): string {
  const full = resolve(relative);
  if (!fs.existsSync(full)) {
    throw new Error(`${relative} does not exist (looked in ${repoRoot()})`);
  }
  return fs.readFileSync(full, 'utf8');
}

/** Read a repository-relative file as a data: URI, for embedding assets inline. */
export function readRepoDataUri(relative: string, mime: string): string {
  return `data:${mime};base64,${fs.readFileSync(resolve(relative)).toString('base64')}`;
}

export const repoPathExists = (relative: string) => fs.existsSync(resolve(relative));

/** The last two path segments, which is what a reader actually needs to see. */
export const repoRelative = (relative: string) => relative.split('/').slice(-2).join('/');
