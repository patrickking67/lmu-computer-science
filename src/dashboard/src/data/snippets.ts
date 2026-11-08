/**
 * Real code, quoted from the tree rather than retyped for display.
 *
 * Each entry names a tracked file and, optionally, a line range. Snippet.astro
 * reads it at build time, so a snippet cannot drift from the coursework: if the
 * file moves or shrinks, the build fails instead of quietly showing something
 * that is no longer there. tests/site-data.test.mjs checks every path and range.
 */
export type Snippet = {
  title: string;
  course: string;
  path: string;
  /** Inclusive 1-based line range. Omit for the whole file. */
  lines?: [number, number];
  /** Why this is worth looking at. */
  caption: string;
};

export const snippets: Snippet[] = [
  {
    title: 'A program in a language I designed',
    course: 'CMSI 3802',
    path: 'src/courses/cmsi-3802/cloudscribe/examples/network_monitoring.csc',
    caption:
      'CloudScribe source. A task is the top-level unit: a named block of work the compiler can check before anything touches a server. It type-checks, compiles to JavaScript, and runs.',
  },
  {
    title: 'The grammar it parses with',
    course: 'CMSI 3802',
    path: 'src/courses/cmsi-3802/cloudscribe/src/cloudscribe.ohm',
    lines: [1, 24],
    caption:
      'The front end, in Ohm. Every alternative gets a case label, and each label becomes a node the semantic pass can match on, which is what keeps the analyser a set of small functions rather than one enormous switch.',
  },
  {
    title: 'Making change, in Haskell',
    course: 'CMSI 3801',
    path: 'src/courses/cmsi-3801/haskell/Exercises.hs',
    lines: [21, 31],
    caption:
      'A greedy walk down the denominations, with the negative case pushed into an Either so a caller cannot quietly ignore it. The type signature says everything a docstring would have.',
  },
  {
    title: 'The same problem, in OCaml',
    course: 'CMSI 3801',
    path: 'src/courses/cmsi-3801/ocaml/exercises.ml',
    lines: [1, 12],
    caption:
      'Same algorithm, different bargain: an exception instead of a sum type, and pattern matching on the list directly. Putting the two side by side is the entire point of the course.',
  },
  {
    title: 'Subnet arithmetic without a library',
    course: 'CMSI 3550',
    path: 'src/courses/cmsi-3550/homework2_subcalc/src/main.rs',
    lines: [36, 48],
    caption:
      'The network address is the address AND the mask; the broadcast address is the network OR the inverted mask. Converting to a 32-bit integer and back is the whole trick.',
  },
];
