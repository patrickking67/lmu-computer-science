/**
 * The three projects the front page leads with, in the order a reader should
 * open them. Every course code and path here is checked against the tree by
 * tests/site-data.test.mjs, like the rest of the data directory.
 */
export type Highlight = {
  name: string;
  /** What it is, in a few words. */
  kind: string;
  /** One or two course codes; Pathfinder spans two semesters. */
  courses: string[];
  term: string;
  /** Two sentences at most. */
  summary: string;
  /** Measured facts, each one stated elsewhere in the repository too. */
  facts: string[];
  /** A path inside this repository. */
  path: string;
  /** Anchor on the Programs page when the project runs there. */
  program?: string;
};

export const highlights: Highlight[] = [
  {
    name: 'CloudScribe',
    kind: 'A compiler',
    courses: ['CMSI 3802'],
    term: 'Spring 2025',
    summary:
      'A statically typed language for the jobs that usually end up in a shell script, compiled to JavaScript in five stages from an Ohm grammar. The submitted compiler runs in your browser on the Programs page.',
    facts: [
      '143 tests at 99.66% statement coverage',
      'Two back-end defects the suite never reached, kept and shown',
    ],
    path: 'src/courses/cmsi-3802/cloudscribe',
    program: 'cloudscribe',
  },
  {
    name: 'The network stack',
    kind: 'Seven projects in Rust',
    courses: ['CMSI 3550'],
    term: 'Spring 2024',
    summary:
      'Working down the stack instead of reading about it: subnet arithmetic from bit operations, then sockets, then two peers moving a file with no server in the middle.',
    facts: ['Subnet calculator from bit operations', 'Peer-to-peer file transfer over raw sockets'],
    path: 'src/courses/cmsi-3550',
  },
  {
    name: 'Pathfinder',
    kind: 'The senior project',
    courses: ['CMSI 4071', 'CMSI 4072'],
    term: 'Fall 2024 to Spring 2025',
    summary:
      'Specified and defended in the first semester before any code existed, then built to that specification in the second: career guidance that reads a student’s coursework and proposes routes through it.',
    facts: ['Vite and React, an Express API, Firebase Cloud Functions', 'Full deliverable set, from specification to demonstration'],
    path: 'src/courses/cmsi-4072/Pathfinder',
  },
];
