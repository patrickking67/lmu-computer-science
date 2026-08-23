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

/**
 * What the repository publishes, which is not what sits in the working tree.
 *
 * docs/publication.md holds two items out of version control pending a
 * decision, and AGENTS.md requires held files to stay untracked and *visible*
 * rather than ignored. So the tree legitimately contains files the repository
 * does not publish. Reading the filesystem therefore failed on a working tree
 * behaving exactly as designed, and passed in CI only because a runner checks
 * out tracked files alone. Ask git, not the disk.
 */
const tracked = (dir) =>
  execFileSync('git', ['ls-files', '-z', '--', dir], { cwd: root, encoding: 'utf8' })
    .split('\0')
    .filter(Boolean);

const trackedDirectly = (dir) =>
  tracked(dir)
    .filter((p) => p.startsWith(`${dir}/`))
    .map((p) => p.slice(dir.length + 1))
    .filter((p) => !p.includes('/'))
    .sort();

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

test('only external programs carry a repo, and they all carry one', () => {
  for (const program of programs) {
    if (program.embed === 'external') {
      assert.ok(program.repo, `${program.name} opens externally with no repo`);
      assert.match(program.repo, /^[\w-]+\/[\w.-]+$/, `${program.name}: repo must be owner/name`);
    } else {
      assert.equal(program.repo, undefined, `${program.name} is not external but names a repo`);
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

// ── CloudScribe back end ─────────────────────────────────────────────────
// Two defects in the submitted compiler are documented in docs/building.md,
// shown in the playground, and described on the site. They are deliberately
// not repaired. These tests pin them: if the coursework is ever edited, or the
// compiler swapped for the upstream one, the pages describing them become
// wrong, and these fail rather than the site quietly lying.
const cloudscribe = 'src/courses/cmsi-3802/cloudscribe';

test("the generator still has no case for the language's own task construct", () => {
  const generator = fs.readFileSync(inRepo(`${cloudscribe}/src/generator.js`), 'utf8');
  assert.ok(
    !generator.includes('TaskDeclaration'),
    'generator.js now handles TaskDeclaration — the pages saying it does not are stale',
  );
  // The analyser was always the half that handled it: it builds the node via
  // core.taskDeclaration, which is what stamps kind: "TaskDeclaration".
  const analyzer = fs.readFileSync(inRepo(`${cloudscribe}/src/analyzer.js`), 'utf8');
  assert.ok(analyzer.includes('core.taskDeclaration('), 'the analyser no longer builds a task node');
});

test('every committed example is wrapped in a task, which is why none of them generate', () => {
  const dir = inRepo(`${cloudscribe}/examples`);
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.csc'));
  assert.equal(files.length, 7, 'the site says seven example programs');
  for (const file of files) {
    const source = fs.readFileSync(path.join(dir, file), 'utf8');
    assert.match(source, /\btask\s+\w+\s*\{/, `${file} no longer uses task`);
  }
});

test('the optimiser visitor that falls through still falls through', () => {
  // foldBinary computes both operands and then returns nothing when it cannot
  // fold, which is what makes `let y = x + 1` emit `let y_1 = ;`.
  const optimizer = fs.readFileSync(inRepo(`${cloudscribe}/src/optimizer.js`), 'utf8');
  const fold = optimizer.slice(optimizer.indexOf('function foldBinary'));
  const body = fold.slice(0, fold.indexOf('\n}'));
  assert.ok(
    !body.includes('core.binary'),
    'foldBinary now rebuilds the node it declined to fold — the defect is fixed, so fix the docs',
  );
});

test('the generator still swallows an undefined expression instead of failing', () => {
  const generator = fs.readFileSync(inRepo(`${cloudscribe}/src/generator.js`), 'utf8');
  assert.match(
    generator,
    /if \(e == null\) return ""/,
    'exp() no longer turns undefined into an empty string — half the silent-output defect is gone',
  );
});

test('the playground offers every committed example, plus one that is labelled as not one', () => {
  // Read as text rather than imported: the module uses Vite's ?raw imports for
  // the .csc files, which only resolve inside a Vite build.
  const source = fs.readFileSync(inRepo('src/dashboard/src/data/cloudscribe-examples.ts'), 'utf8');
  const onDisk = fs
    .readdirSync(inRepo(`${cloudscribe}/examples`))
    .filter((f) => f.endsWith('.csc'));
  for (const file of onDisk) {
    assert.ok(source.includes(`examples/${file}?raw`), `the playground is missing ${file}`);
  }
  assert.equal(
    (source.match(/committed: true/g) ?? []).length,
    onDisk.length,
    'every committed example must be marked as one',
  );
  assert.equal(
    (source.match(/committed: false/g) ?? []).length,
    1,
    'exactly one non-coursework sample, and it must be labelled as such',
  );
});

test('no program claims to embed a WebContainer in the page', () => {
  // It cannot work: GitHub Pages cannot send isolation headers, and StackBlitz's
  // embed page loads third-party resources without CORP regardless.
  for (const program of programs) {
    assert.notEqual(program.embed, 'container', `${program.name} still uses the container mode`);
  }
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
  const inIndex = [...new Set(tracked('src/courses').map((p) => p.split('/')[2]))]
    .filter((d) => d.startsWith('cmsi-'))
    .sort();
  const declared = courses.map((c) => c.slug).sort();
  assert.deepEqual(inIndex, declared);
});

test('the two courses that produced no repository still have a directory', () => {
  // CMSI 1900 was a zero-unit seminar and CMSI 3920 a summer session. Both
  // carry a README and nothing else, which is why they are easy to miscount.
  for (const slug of ['cmsi-1900', 'cmsi-3920']) {
    assert.deepEqual(
      trackedDirectly(`src/courses/${slug}`),
      ['README.md'],
      `${slug} unexpectedly publishes code`,
    );
  }
});

test('the held publication items are untracked and not ignored', () => {
  // docs/publication.md leaves two items out of version control pending a
  // decision, and AGENTS.md requires them to stay visible in `git status`
  // rather than be hidden by .gitignore. Both halves are asserted, because
  // ignoring them would satisfy "untracked" while defeating the point.
  const held = [
    'src/courses/cmsi-3300/HW3 Answers (Pacman AI)',
    'src/courses/cmsi-3920/fraser-2010-injustice-at-intersecting-scales-on-social-exclusion-and-the-global-poor.pdf',
  ];
  // `git check-ignore -q` exits 0 when the path IS ignored and 1 when it is not,
  // and execFileSync throws on a non-zero exit, so absence is the passing case.
  // It answers from the ignore rules alone and needs no file on disk. One wrinkle:
  // an absent path is treated as a file, so a directory-only rule -- the natural way
  // to hide the first held item -- never matches the bare path. Probing the
  // trailing-slash form too covers directory rules, and with no rule in place
  // neither form matches, so the second probe adds no false positive.
  const probes = (item) => [item, `${item}/`];
  const isIgnored = (item) =>
    probes(item).some((path) => {
      try {
        execFileSync('git', ['check-ignore', '-q', '--', path], { cwd: root, stdio: 'ignore' });
        return true;
      } catch {
        return false;
      }
    });

  for (const item of held) {
    // Unconditional: check-ignore answers from the ignore rules alone and needs no
    // file on disk, so this half holds on a runner too. That matters, because a
    // runner checks out tracked files only and these are deliberately untracked --
    // gating this on existence made it a no-op in exactly the place it had to run.
    assert.equal(isIgnored(item), false, `${item} is ignored; it must stay visible`);

    // Still gated. A wrongly-tracked item IS checked out on a runner, so the gate
    // cannot hide that failure; removing it would instead fail main the day the
    // publication decision goes the other way and the item is committed on purpose.
    if (!fs.existsSync(inRepo(item))) continue; // decided and removed; nothing to track
    assert.equal(tracked(item).length, 0, `${item} is tracked; publication.md holds it`);
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
  // StackBlitz cannot open a private repository at all, so the two must
  // never disagree.
  const external = new Set(programs.filter((p) => p.embed === 'external').map((p) => p.repo));
  for (const live of liveRepos.filter((r) => r.visibility === 'private')) {
    assert.ok(
      !external.has(`patrickking67/${live.repo}`),
      `${live.repo} is private but sent to StackBlitz, which cannot open it`,
    );
  }
});
