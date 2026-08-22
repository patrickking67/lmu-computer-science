/**
 * CloudScribe, running in the browser.
 *
 * This imports the submitted compiler directly out of src/courses — the real
 * analyzer.js, optimizer.js and generator.js, 727 lines of it, unmodified.
 *
 * Only one thing is substituted. `parser.js` builds its grammar with
 * `fs.readFileSync("src/cloudscribe.ohm")`, which needs a filesystem and a
 * particular working directory; neither exists in a browser tab. So the
 * grammar text is imported at build time and the three-line parse is
 * reproduced here. Everything downstream is the coursework itself.
 *
 * Two defects in the submitted back end are load-bearing for what this shows,
 * and are documented in docs/building.md:
 *
 *   - generator.js has no TaskDeclaration case, so every program in
 *     examples/ throws at the generate stage
 *   - optimizer.js foldBinary returns undefined for anything it cannot
 *     constant-fold, and generator.js exp() turns that into an empty string,
 *     so `x + 1` compiles to nothing at all
 *
 * The playground surfaces both rather than routing around them.
 */
import * as ohm from 'ohm-js';

// The real grammar file, read at build time.
import grammarSource from '../../../courses/cmsi-3802/cloudscribe/src/cloudscribe.ohm?raw';

// The real compiler stages, imported unmodified.
import analyze from '../../../courses/cmsi-3802/cloudscribe/src/analyzer.js';
import optimize from '../../../courses/cmsi-3802/cloudscribe/src/optimizer.js';
import generate from '../../../courses/cmsi-3802/cloudscribe/src/generator.js';

export type Stage = 'parsed' | 'analyzed' | 'optimized' | 'js';

export const STAGES: { id: Stage; label: string; hint: string }[] = [
  { id: 'parsed',    label: 'Parse',    hint: 'Ohm matches the source against the grammar' },
  { id: 'analyzed',  label: 'Analyse',  hint: 'Types are resolved and illegal programs rejected' },
  { id: 'optimized', label: 'Optimise', hint: 'Constant folding and dead-branch removal' },
  { id: 'js',        label: 'Generate', hint: 'Emit JavaScript' },
];

const grammar = ohm.grammar(grammarSource);

export type Result =
  | { ok: true; stage: Stage; output: string }
  | { ok: false; stage: Stage; error: string };

/**
 * Render an analysed or optimised tree the way the CLI does.
 *
 * The real CLI uses graph-stringify for this. Rather than take a second
 * dependency for one display path, this walks the tree directly and numbers
 * shared nodes the same way.
 */
function describe(root: unknown): string {
  const lines: string[] = [];
  const seen = new Map<object, number>();
  const queue: object[] = [];

  const ref = (value: unknown): string => {
    if (value === null || value === undefined) return String(value);
    if (typeof value === 'string') return JSON.stringify(value);
    if (typeof value !== 'object') return String(value);
    if (Array.isArray(value)) return `[${value.map(ref).join(',')}]`;
    let id = seen.get(value);
    if (id === undefined) {
      id = seen.size + 1;
      seen.set(value, id);
      queue.push(value);
    }
    return `#${id}`;
  };

  ref(root as object);
  for (let i = 0; i < queue.length; i++) {
    const node = queue[i] as Record<string, unknown>;
    const id = seen.get(node)!;
    const kind = (node.kind as string) ?? node.constructor?.name ?? 'Object';
    const fields = Object.entries(node)
      .filter(([key]) => key !== 'kind')
      .map(([key, value]) => `${key}=${ref(value)}`);
    lines.push(`${String(id).padStart(4)} | ${kind} ${fields.join(' ')}`.trimEnd());
  }
  return lines.join('\n');
}

/** Run the pipeline as far as `stage`, reporting where it stopped if it fails. */
export function compile(source: string, stage: Stage): Result {
  let reached: Stage = 'parsed';
  try {
    const match = grammar.match(source);
    if (!match.succeeded()) {
      return { ok: false, stage: 'parsed', error: (match as { message?: string }).message ?? 'Syntax error' };
    }
    if (stage === 'parsed') return { ok: true, stage, output: 'Syntax is ok' };

    reached = 'analyzed';
    const analyzed = analyze(match);
    if (stage === 'analyzed') return { ok: true, stage, output: describe(analyzed) };

    reached = 'optimized';
    const optimized = optimize(analyzed);
    if (stage === 'optimized') return { ok: true, stage, output: describe(optimized) };

    reached = 'js';
    return { ok: true, stage, output: generate(optimized) };
  } catch (error) {
    return { ok: false, stage: reached, error: error instanceof Error ? error.message : String(error) };
  }
}
