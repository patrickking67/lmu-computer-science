/**
 * The site publishes claims about the repository: that a program lives at a
 * path, that a snippet quotes real lines, that 15,950 lines of coursework
 * exist. Each of those can rot silently — a file moves, a course is renamed, a
 * count goes stale — and the page keeps rendering, now lying.
 *
 * These tests read the site's own data files and check every claim against the
 * tree. Run with:  node --test tests/
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const data = (name) => import(path.join(root, 'src/dashboard/src/data', name));

const { programs } = await data('programs.ts');
const { courses, liveRepos, toolkit } = await data('courses.ts');
const { snippets } = await data('snippets.ts');
const { languages, totalLines, figures } = await data('stats.ts');

const inRepo = (p) => path.join(root, p);
const courseCodes = new Set(courses.map((c) => c.code));

test('every program path exists in the tree', () => {
  for (const program of programs) {
    assert.ok(fs.existsSync(inRepo(program.path)), `${program.name}: ${program.path} is missing`);
  }
});

test('every program names a course that exists', () => {
  for (const program of programs) {
    assert.ok(courseCodes.has(program.course), `${program.name} cites ${program.course}`);
  }
});

test('only container programs carry a repo, and they all carry one', () => {
  for (const program of programs) {
    if (program.embed === 'container') {
      assert.ok(program.repo, `${program.name} is a container with no repo`);
      assert.match(program.repo, /^[\w-]+\/[\w.-]+$/, `${program.name}: repo must be owner/name`);
    } else {
      assert.equal(program.repo, undefined, `${program.name} is not a container but names a repo`);
    }
  }
});

test('the inline program still has the three files the embed composes', () => {
  for (const program of programs.filter((p) => p.embed === 'inline')) {
    for (const file of ['index.html', 'cic.css', 'cic.js', 'Interest.jpeg']) {
      assert.ok(fs.existsSync(inRepo(`${program.path}/${file}`)), `${program.path}/${file}`);
    }
  }
});

test('the calculator still has the broken image reference the embed rewrites', () => {
  // If the coursework were ever "fixed", the embed's replace would silently
  // become a no-op and the note on the page would be wrong.
  const [inline] = programs.filter((p) => p.embed === 'inline');
  const html = fs.readFileSync(inRepo(`${inline.path}/index.html`), 'utf8');
  assert.ok(html.includes('src="interest.jpg"'), 'expected the original interest.jpg reference');
});

test('every snippet quotes lines that actually exist', () => {
  for (const snippet of snippets) {
    const full = inRepo(snippet.path);
    assert.ok(fs.existsSync(full), `${snippet.title}: ${snippet.path} is missing`);
    const count = fs.readFileSync(full, 'utf8').split('\n').length;
    const [from, to] = snippet.lines ?? [1, count];
    assert.ok(from >= 1 && from <= to, `${snippet.title}: range ${from}-${to} is inverted`);
    assert.ok(to <= count, `${snippet.title}: wants line ${to} of a ${count}-line file`);
  }
});

test('every snippet names a course that exists', () => {
  for (const snippet of snippets) {
    assert.ok(courseCodes.has(snippet.course), `${snippet.title} cites ${snippet.course}`);
  }
});

test('courses.ts and src/courses agree in both directions', () => {
  const onDisk = fs.readdirSync(inRepo('src/courses')).filter((d) => d.startsWith('cmsi-')).sort();
  const declared = courses.map((c) => c.slug).sort();
  assert.deepEqual(onDisk, declared);
});

test('the two courses that produced no repository still have a directory', () => {
  // CMSI 1900 was a zero-unit seminar and CMSI 3920 a summer session. Both
  // carry a README and nothing else, which is why they are easy to miscount.
  for (const slug of ['cmsi-1900', 'cmsi-3920']) {
    const files = fs.readdirSync(inRepo(`src/courses/${slug}`));
    assert.deepEqual(files, ['README.md'], `${slug} unexpectedly holds code`);
  }
});

test('courses are listed in the order they were taken', () => {
  const codes = courses.map((c) => Number(c.code.split(' ')[1]));
  assert.deepEqual(codes, [...codes].sort((a, b) => a - b));
});

test('the published language counts match a fresh count', () => {
  const raw = execFileSync('python3', ['-m', 'lmucs.cli', 'stats', '--json', '--root', root], {
    cwd: path.join(root, 'src/packages/lmucs'),
    encoding: 'utf8',
  });
  const fresh = JSON.parse(raw);
  assert.equal(totalLines, fresh.total, 'stats.ts total is stale — re-run lmucs stats');
  assert.deepEqual(
    languages.map((l) => [l.name, l.lines]),
    fresh.languages.map((l) => [l.name, l.lines]),
    'stats.ts language table is stale — re-run lmucs stats',
  );
});

test('the headline figures agree with the data behind them', () => {
  const byLabel = Object.fromEntries(figures.map((f) => [f.label, f.value]));
  assert.equal(byLabel.courses, String(courses.length));
  assert.equal(byLabel.languages, String(languages.length));
  assert.equal(byLabel['lines of coursework'], totalLines.toLocaleString('en-US'));
});

test('every toolkit entry cites where it was used', () => {
  for (const tool of toolkit) {
    assert.ok(tool.where.trim().length > 0, `${tool.name} cites nothing`);
    assert.ok([1, 2, 3].includes(tool.weight), `${tool.name} has weight ${tool.weight}`);
  }
  const names = toolkit.map((t) => t.name);
  assert.equal(new Set(names).size, names.length, 'duplicate toolkit entries');
});

test('live repositories are labelled with a visibility we can honour', () => {
  for (const live of liveRepos) {
    assert.ok(['public', 'private'].includes(live.visibility), `${live.name}: ${live.visibility}`);
  }
  // A container embed against a private repository cannot boot, so the two
  // must never disagree.
  const containers = new Set(programs.filter((p) => p.embed === 'container').map((p) => p.repo));
  for (const live of liveRepos.filter((r) => r.visibility === 'private')) {
    assert.ok(
      !containers.has(`patrickking67/${live.repo}`),
      `${live.repo} is private but embedded as a container`,
    );
  }
});
