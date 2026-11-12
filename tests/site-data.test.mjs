/**
 * The site publishes claims about the repository: that a program lives at a
 * path, that a snippet quotes real lines, that 15,950 lines of coursework
 * exist. Each of those can rot silently — a file moves, a course is renamed, a
 * count goes stale — and the page keeps rendering, now lying.
 *
 * These tests read the site's own data files and check every claim against the
 * tree. Run with:  node --test "tests/*.test.mjs"
 *
 * A glob, not a directory: `node --test tests/` tries to load the directory
 * itself as a module and fails.
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
const { courses, liveRepos, toolkit, progression } = await data('courses.ts');
const { snippets } = await data('snippets.ts');
const { languages, totalLines, figures, linesByCourse, checks } = await data('stats.ts');
const { highlights } = await data('highlights.ts');
const { projects } = await data('projects.ts');
const { figures: diagrams } = await data('figures.ts');
const courseMap = await import(path.join(root, 'scripts/course-map.mjs'));

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

test('the wiki documents exactly the run modes that exist', () => {
  // The data files were checked against the tree and the prose was not, so the
  // prose rotted: the wiki tabled a `container` mode that had been removed as
  // impossible, and omitted `playground` and `external`, the two modes doing
  // the work. Set equality against the declaration catches both directions.
  const source = fs.readFileSync(inRepo('src/dashboard/src/data/programs.ts'), 'utf8');
  const union = source.match(/embed:\s*((?:'[a-z]+'\s*\|\s*)*'[a-z]+')\s*;/);
  assert.ok(union, 'no embed union found in programs.ts — this test is checking nothing');
  const declared = new Set([...union[1].matchAll(/'([a-z]+)'/g)].map((m) => m[1]));
  // Two empty sets compare equal, which is the way this test would go green
  // while measuring nothing at all. Refuse that before comparing.
  assert.ok(declared.size >= 2, `the embed union parsed to ${declared.size} mode(s); fix the parse`);

  const page = 'src/dashboard/src/content/wiki/how-the-site-works.md';
  // The first cell of a table row, and nowhere else. The page backticks
  // filenames and component names freely in its prose, and a backticked word
  // in the *description* column — `npm install`, say — would read as a mode and
  // fail this test for no reason, sending someone off to edit the union type.
  const documented = new Set(
    fs
      .readFileSync(inRepo(page), 'utf8')
      .split('\n')
      .filter((line) => line.startsWith('|'))
      .flatMap((line) => [...(line.split('|')[1] ?? '').matchAll(/`([a-z]+)`/g)].map((m) => m[1])),
  );
  assert.deepEqual(
    [...documented].sort(),
    [...declared].sort(),
    `${page} and the programs.ts embed union disagree about the run modes`,
  );

  for (const program of programs) {
    assert.ok(declared.has(program.embed), `${program.name} uses undeclared mode ${program.embed}`);
  }
});

test('the README does not promise a WebContainer', () => {
  // Blunt on purpose, like the container-mode test above. No page here can
  // embed one, so the front door has no honest reason to name the technology;
  // why it cannot is design history, and lives in AGENTS.md and the wiki. The
  // README claimed CloudScribe and myGainz "boot in a WebContainer" for as long
  // as the modes that replaced it have existed.
  const readme = fs.readFileSync(inRepo('README.md'), 'utf8');
  assert.ok(
    !readme.includes('WebContainer'),
    'the README names WebContainer again; nothing on this site can embed one',
  );
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

test('the playground tabs are a tablist, not four buttons that say tab', () => {
  const src = fs.readFileSync(inRepo('src/dashboard/src/components/Playground.astro'), 'utf8');

  // A tablist may contain only tabs. Run is not one, and it used to live inside.
  const tablist = src.match(/role="tablist"[\s\S]*?<\/div>/);
  assert.ok(tablist, 'the tablist markup moved; this test needs rewriting');
  assert.ok(!tablist[0].includes('id="cs-run"'), 'the Run button is back inside the tablist');

  // Tabs that control nothing are broken semantics, not decoration.
  assert.ok(src.includes('aria-controls="cs-panel"'), 'the tabs no longer point at a panel');
  assert.ok(/id="cs-panel"[\s\S]{0,240}role="tabpanel"/.test(src), 'the output pane is not a tabpanel');

  // The panel scrolls. A scrollable region that cannot take focus cannot be
  // scrolled from the keyboard, which is WCAG 2.1.1, not a nicety.
  assert.ok(/role="tabpanel"[\s\S]{0,160}tabindex="0"/.test(src), 'the panel is not focusable');

  // Roving tabindex and the arrow keys are what make it behave like a tablist.
  assert.ok(src.includes('tab.tabIndex = on ? 0 : -1'), 'roving tabindex is gone');
  for (const key of ['ArrowRight', 'ArrowLeft', 'Home', 'End']) {
    assert.ok(src.includes(key), `${key} handling is gone from the tablist`);
  }
});

test('the page CSP stays narrow, because a script-src would break the embeds', () => {
  const base = fs.readFileSync(inRepo('src/dashboard/src/layouts/Base.astro'), 'utf8');
  const meta = base.match(/http-equiv="Content-Security-Policy"[\s\S]{0,400}?content="([^"]+)"/);
  assert.ok(meta, 'Base.astro no longer sets a Content-Security-Policy');
  const policy = meta[1];

  // Measured 2026-08-22 in the browser: a sandboxed srcdoc iframe inherits the
  // embedding page's CSP. Both the inline calculator embed and the playground's
  // Run stage execute inline script inside one, and the playground's script is
  // generated from whatever the visitor typed, so no build-time hash can cover
  // it and static hosting has no nonce. script-src would break both features;
  // default-src would too, by falling back to it.
  for (const directive of ['script-src', 'default-src']) {
    assert.ok(
      !policy.includes(directive),
      `${directive} in the page CSP silently breaks the inline embed and the playground`,
    );
  }
  // And the directives that do earn their place stay put.
  for (const directive of ["object-src 'none'", "base-uri 'self'"]) {
    assert.ok(policy.includes(directive), `${directive} dropped from the page CSP`);
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

test('the front-page highlights point at real courses, paths and programs', () => {
  assert.ok(highlights.length > 0, 'no highlights parsed; this test is checking nothing');
  // The Programs page derives each anchor from the program name the same way.
  const anchor = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const runnable = new Set(programs.filter((p) => p.embed !== 'source').map((p) => anchor(p.name)));
  for (const h of highlights) {
    for (const code of h.courses) {
      assert.ok(courseCodes.has(code), `${h.name}: ${code} is not a course`);
    }
    assert.ok(tracked(h.path).length > 0, `${h.name}: ${h.path} holds no tracked files`);
    if (h.program) {
      assert.ok(runnable.has(h.program), `${h.name}: #${h.program} is not a runnable program anchor`);
    }
  }
});

test('every counted language is found in at least one course directory', () => {
  assert.ok(linesByCourse.length > 0, 'no per-course counts parsed; this test is checking nothing');
  const found = new Set(linesByCourse.flatMap((c) => c.languages.map((l) => l.name)));
  for (const l of languages) {
    assert.ok(found.has(l.name), `${l.name} has a line count but no course holds a file in it`);
  }
});

test('the per-course line counts match a fresh count and sum to the totals', () => {
  const raw = execFileSync('python3', ['-m', 'lmucs.cli', 'stats', '--json', '--root', root], {
    cwd: path.join(root, 'src/packages/lmucs'),
    encoding: 'utf8',
  });
  const fresh = JSON.parse(raw).by_course.map((c) => [
    c.course.toUpperCase().replace('-', ' '),
    c.languages.map((l) => [l.name, l.lines]),
  ]);
  assert.deepEqual(
    linesByCourse.map((c) => [c.course, c.languages.map((l) => [l.name, l.lines])]),
    fresh,
    'stats.ts linesByCourse is stale; re-run lmucs stats --json',
  );
  const summed = new Map();
  for (const c of linesByCourse) {
    assert.ok(courseCodes.has(c.course), `${c.course} is not a course`);
    for (const l of c.languages) summed.set(l.name, (summed.get(l.name) ?? 0) + l.lines);
  }
  assert.deepEqual(Object.fromEntries(summed), Object.fromEntries(languages.map((l) => [l.name, l.lines])));
});

test('the generated course map in README.md and docs/course-map.md is current', async () => {
  const { doc, block } = await courseMap.build();
  assert.ok(doc.includes('| Language |') && block.includes('| Term |'), 'the generator produced no tables');
  assert.deepEqual(await courseMap.stale(), [], 'run: node scripts/course-map.mjs');
});

test('every case study points at real courses, paths, programs and figures', () => {
  assert.equal(projects.length, 3, 'the site leads with three projects');
  const anchor = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const runnable = new Set(programs.filter((p) => p.embed !== 'source').map((p) => anchor(p.name)));
  for (const p of projects) {
    for (const code of p.courses) assert.ok(courseCodes.has(code), `${p.name}: ${code} is not a course`);
    assert.ok(p.sources.length > 0, `${p.name} links to no source`);
    for (const s of p.sources) assert.ok(tracked(s.path).length > 0, `${p.name}: ${s.path} is not tracked`);
    if (p.program) assert.ok(runnable.has(p.program), `${p.name}: #${p.program} is not a runnable program`);
    assert.ok(diagrams[p.slug], `${p.name} has no figure`);
    assert.ok(p.differently.length >= 3 && p.problem.length > 0 && p.approach.length > 0, `${p.name} is missing a section`);
  }
  const slugs = new Set(projects.map((p) => p.slug));
  for (const h of highlights) assert.ok(slugs.has(h.project), `${h.name}: no case study "${h.project}"`);
  assert.ok(tracked('src/dashboard/public/shots/pathfinder-tools.png').length > 0, 'the Pathfinder screenshot is missing');
});

test('every figure names real files and only connects boxes it draws', () => {
  for (const figure of Object.values(diagrams)) {
    const ids = new Set(figure.nodes.map((n) => n.id));
    assert.equal(ids.size, figure.nodes.length, `${figure.id}: duplicate node id`);
    for (const n of figure.nodes) {
      if (n.path) assert.ok(tracked(n.path).length > 0, `${figure.id}: ${n.path} is not tracked`);
      assert.ok(n.x >= 0 && n.x + n.w <= figure.width && n.y + n.h <= figure.height, `${figure.id}: ${n.id} is outside the drawing`);
    }
    for (const e of figure.edges) {
      assert.ok(ids.has(e.from) && ids.has(e.to), `${figure.id}: edge ${e.from} to ${e.to} names a missing box`);
    }
  }
});

test('the course progression runs forward in time and matches the diagram in docs/architecture.md', () => {
  const when = new Map(courses.map((c) => [c.code, courseMap.termOrder(c.term)]));
  for (const step of progression) {
    assert.ok(when.has(step.from) && when.has(step.to), `${step.from} to ${step.to}: not a course`);
    assert.ok(when.get(step.from) < when.get(step.to), `${step.from} was not taken before ${step.to}`);
  }
  const doc = fs.readFileSync(inRepo('docs/architecture.md'), 'utf8');
  const chart = doc.slice(doc.indexOf('## 2.'), doc.indexOf('## 3.'));
  const code = (id) => `CMSI ${id.slice(1)}`;
  const drawn = [...chart.matchAll(/^\s+(c\d{4}) -->\|"[^"]*"\| (c\d{4})$/gm)].map((m) => `${code(m[1])}>${code(m[2])}`);
  assert.ok(drawn.length > 0, 'no edges parsed from the flowchart; fix the parse');
  assert.deepEqual(drawn.sort(), progression.map((s) => `${s.from}>${s.to}`).sort());
  const boxes = new Set([...chart.matchAll(/^\s+(c\d{4})\["/gm)].map((m) => code(m[1])));
  assert.deepEqual([...boxes].sort(), [...courseCodes].sort(), 'the flowchart must draw every course exactly once');
});

test('docs/architecture.md links only to paths that exist', () => {
  const doc = fs.readFileSync(inRepo('docs/architecture.md'), 'utf8');
  const links = [...doc.matchAll(/\]\((\.\.\/[^)]+|[a-z-]+\.md)\)/g)].map((m) => m[1]);
  assert.ok(links.length >= 6, `parsed ${links.length} link(s) from architecture.md; fix the parse`);
  for (const link of links) {
    const target = path.posix.normalize(path.posix.join('docs', link));
    assert.ok(tracked(target).length > 0, `architecture.md links to ${target}, which is not tracked`);
  }
  assert.equal([...doc.matchAll(/^```mermaid$/gm)].length, 6, 'architecture.md promises six diagrams');
});

test('the proof figures on the front page are counted, not typed', () => {
  const own = fs.readFileSync(inRepo('tests/site-data.test.mjs'), 'utf8');
  assert.equal(checks.siteDataTests, [...own.matchAll(/^test\(/gm)].length, 'stats.ts checks.siteDataTests is stale');
  const py = tracked('src/packages/lmucs/tests')
    .filter((p) => p.endsWith('.py'))
    .map((p) => fs.readFileSync(inRepo(p), 'utf8'));
  assert.equal(checks.lmucsTests, py.join('\n').match(/^def test_/gm).length, 'stats.ts checks.lmucsTests is stale');

  const building = fs.readFileSync(inRepo('docs/building.md'), 'utf8');
  assert.ok(building.includes(`## Suites run on ${checks.suitesDate}`), 'building.md has no matrix for that date');
  const rows = [];
  for (const part of building.split(/^## /m).filter((p) => p.startsWith('Suites run on '))) {
    const table = part.slice(0, part.indexOf('\n\n', part.indexOf('|---')));
    rows.push(...table.split('\n').filter((line) => /^\| CMSI \d{4} \|/.test(line)));
  }
  assert.equal(checks.suitesRun, rows.length, 'stats.ts checks.suitesRun does not match the matrix');
  assert.ok(rows.some((r) => r.includes(`${checks.cloudscribeTests} passed`)), 'the cloudscribe row disagrees with stats.ts');

  const workflow = fs.readFileSync(inRepo('.github/workflows/check-ai-config.yml'), 'utf8');
  assert.match(workflow, new RegExp(`os: \\[${checks.ciRunners.join(', ')}\\]`), 'the runner list is stale');
});

test('the README leads with the three projects, each with a picture, its code and its page', () => {
  const readme = fs.readFileSync(inRepo('README.md'), 'utf8');
  const siteUrl = 'https://patrickking67.github.io/lmu-computer-science/';
  const firstCourseTable = readme.indexOf(courseMap.START);
  assert.ok(firstCourseTable > 0, 'README.md has no generated course map');
  for (const p of projects) {
    const page = readme.indexOf(`${siteUrl}projects/${p.slug}/`);
    assert.ok(page > 0 && page < firstCourseTable, `${p.name}: its site page must be linked above the course map`);
  }
  const images = [...readme.matchAll(/(?:src|srcset)="([^"]+\.(?:png|webp|svg))"/g)].map((m) => m[1]);
  assert.ok(images.length >= 4, `parsed ${images.length} image(s) from README.md; fix the parse`);
  for (const image of images) assert.ok(tracked(image).length > 0, `README.md shows ${image}, which is not tracked`);
  for (const image of tracked('docs/assets')) {
    assert.ok(fs.statSync(inRepo(image)).size < 300 * 1024, `${image} is over 300 KB`);
  }
  const badges = [...readme.matchAll(/^\[!\[/gm)].length;
  assert.ok(badges >= 2 && badges <= 4, `README.md carries ${badges} badges; the limit is four`);
  assert.equal(/\u2014/.test(readme), false, 'README.md contains an em dash');
  assert.ok(readme.includes(`| Site-data tests | ${checks.siteDataTests},`), 'README.md site-data test count is stale');
  assert.ok(readme.includes(`| Package tests | ${checks.lmucsTests} in`), 'README.md package test count is stale');
  assert.ok(readme.includes(`| Course suites | ${checks.suitesRun} run by ${checks.suitesDate},`), 'README.md suite count is stale');
});

test('llms.txt is served from the site root, matches the repository copy, and links resolve', () => {
  const rootCopy = fs.readFileSync(inRepo('llms.txt'), 'utf8');
  const served = fs.readFileSync(inRepo('src/dashboard/public/llms.txt'), 'utf8');
  assert.equal(served, rootCopy, 'src/dashboard/public/llms.txt and llms.txt have drifted');
  assert.match(rootCopy, /^# .+\n\n> .+/, 'llms.txt must open with an H1 and a > summary');

  const links = [...rootCopy.matchAll(/\]\((https:\/\/[^)\s]+)\)/g)].map((m) => m[1]);
  assert.ok(links.length >= 5, `llms.txt parsed to ${links.length} link(s); fix the parse`);

  const repoUrl = 'https://github.com/patrickking67/lmu-computer-science/';
  const siteUrl = 'https://patrickking67.github.io/lmu-computer-science/';
  const wiki = new Set(tracked('src/dashboard/src/content/wiki').map((p) => path.basename(p, '.md')));
  const sections = new Set(['', 'programs/', 'projects/', 'courses/', 'wiki/', 'contact/', ...projects.map((p) => `projects/${p.slug}/`)]);
  for (const link of links) {
    if (link.startsWith(repoUrl)) {
      const target = link.slice(repoUrl.length).replace(/^(blob|tree)\/main\//, '');
      assert.ok(tracked(target).length > 0, `llms.txt links to ${target}, which is not tracked`);
    } else if (link.startsWith(siteUrl)) {
      const route = link.slice(siteUrl.length);
      const page = route.match(/^wiki\/([\w-]+)\/$/);
      const course = route.match(/^courses\/(cmsi-\d{4})\/$/);
      assert.ok(
        sections.has(route) || (page && wiki.has(page[1])) || (course && courseCodes.has(course[1].toUpperCase().replace('-', ' '))),
        `llms.txt links to /${route}, which the site does not build`,
      );
    }
  }
});
