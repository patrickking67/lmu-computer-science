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
  /** Slug of its case study in data/projects.ts. */
  project: string;
  /** The one hard thing, in a sentence. */
  hard: string;
};

export const highlights: Highlight[] = [
  {
    name: 'CloudScribe',
    kind: 'A compiler',
    courses: ['CMSI 3802'],
    term: 'Spring 2025',
    summary:
      'A statically typed language for the jobs that usually end up in a shell script, compiled to JavaScript in four stages from an Ohm grammar. The submitted compiler runs in your browser.',
    facts: [
      '143 tests at 99.66% statement coverage',
      'Two back-end defects the suite never reached, kept and shown',
    ],
    path: 'src/courses/cmsi-3802/cloudscribe',
    program: 'cloudscribe',
    project: 'cloudscribe',
    hard: 'Rejecting a bad program with a line and column before any output exists: the static analyzer is 462 of the compiler’s 1,040 lines.',
  },
  {
    name: 'The network stack',
    kind: 'Seven projects in Rust',
    courses: ['CMSI 3550'],
    term: 'Spring 2024',
    summary:
      'Working up from an address to an application: subnet arithmetic from bit operations, then a peer-to-peer trading card network on libp2p, with TCP, Noise, mplex, mDNS and Floodsub and no server in the middle.',
    facts: ['Subnet calculator from bit operations alone', 'Peers discover each other by mDNS and talk over an encrypted, multiplexed TCP stream'],
    path: 'src/courses/cmsi-3550',
    project: 'network-stack',
    hard: 'Getting request and response out of Floodsub, a protocol that only broadcasts: every reply names the peer it is for, and everyone else drops it.',
  },
  {
    name: 'Pathfinder',
    kind: 'The senior project',
    courses: ['CMSI 4071', 'CMSI 4072'],
    term: 'Fall 2024 to Spring 2025',
    summary:
      'Specified and reviewed in the first semester before any code existed, then built in the second by a team of four: a questionnaire, a chat coach, a resume reviewer and a salary estimator behind one sign-in.',
    facts: ['Vite and React, Firebase Auth, an Express API, Cloud Functions', 'Seven deliverable documents, from proposal to test procedure'],
    path: 'src/courses/cmsi-4072/Pathfinder',
    project: 'pathfinder',
    hard: 'Holding a four-person build to a specification written a semester earlier, and keeping the app answering when the model call fails.',
  },
];
