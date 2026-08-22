/**
 * The fifteen CMSI courses. Terms come from the author's course audit, not
 * from instructor course pages — all four checked disagreed with the
 * enrolment term. Titles are the LMU Academic Bulletin titles.
 *
 * Grades are deliberately absent. They live in docs/record.md; this is a
 * portfolio surface and does not repeat them.
 */
export type Course = {
  code: string;
  slug: string;
  title: string;
  term: string;
  /** Two or three sentences. What the course was, and what it left behind. */
  blurb: string;
  /** Short label for the card. Null for the lecture and seminar courses. */
  work: string | null;
  stack: string[];
  /** Specific artefacts, for the course page. */
  highlights?: string[];
};

export const courses: Course[] = [
  {
    code: 'CMSI 1010', slug: 'cmsi-1010', title: 'Computer Programming Laboratory', term: 'Fall 2021',
    blurb:
      'Where it started. Control flow, functions, decomposition, and the habit — enforced from week one — of writing the test before you trust the answer.',
    work: null, stack: ['Python'],
  },
  {
    code: 'CMSI 1900', slug: 'cmsi-1900', title: 'Exploring Computer Science', term: 'Fall 2021',
    blurb:
      'A zero-unit first-year seminar on what the field actually contains, taught by the people doing each part of it. No repository, which is why a directory count of this tree returns thirteen instead of fifteen.',
    work: null, stack: [],
  },
  {
    code: 'CMSI 2021', slug: 'cmsi-2021', title: 'Web Application Development', term: 'Fall 2022',
    blurb:
      'Four front ends built end to end, from a calculator with no dependencies at all to a multi-user application with real accounts. myGainz came out of this one and is still running.',
    work: 'myGainz and 3 web apps', stack: ['React', 'Firebase', 'Firestore', 'Tailwind', 'HTML', 'CSS'],
    highlights: [
      'myGainz — training log on Firebase Auth and Firestore',
      'Blog Application — multi-user posts, ownership enforced server-side',
      'Artist Data API — MusicBrainz queries with disambiguation',
      'Compound Interest Calculator — three files, no build step',
    ],
  },
  {
    code: 'CMSI 2120', slug: 'cmsi-2120', title: 'Data Structures and Applications', term: 'Spring 2022',
    blurb:
      'Lists, trees, hash tables and graphs, and the part that matters — what each one costs, and how expensive it is to have chosen wrong three months later.',
    work: null, stack: ['Java'],
  },
  {
    code: 'CMSI 2130', slug: 'cmsi-2130', title: 'Algorithms and Analysis', term: 'Spring 2023',
    blurb:
      'Five projects, 27 Java sources, each one a classical algorithm implemented rather than described: A* over a grid with constraints, Huffman coding, Damerau–Levenshtein edit distance, and minimax with alpha–beta pruning.',
    work: '5 projects, 27 Java sources', stack: ['Java', 'JUnit', 'Maven'],
    highlights: [
      'Pathfinder — A* with a consistent heuristic over constrained grids',
      'Huffman Coding Compression — encoder, decoder and a bit-level trie',
      'Distle — edit-distance table with transposition, and a word-guessing agent on top',
      'Tic Tac Toe — minimax with alpha–beta pruning',
      'Classification — supervised learning against a held-out set',
    ],
  },
  {
    code: 'CMSI 2210', slug: 'cmsi-2210', title: 'Computer Systems Organization', term: 'Fall 2022',
    blurb:
      'Assembly, registers, addressing modes and memory layout. The course that turns a pointer from a rule you follow into a number you can see.',
    work: null, stack: ['Assembly', 'C'],
  },
  {
    code: 'CMSI 2820', slug: 'cmsi-2820', title: 'Discrete Mathematics for Computer Science', term: 'Fall 2022',
    blurb:
      'Logic, proof technique, combinatorics, relations and graph theory. Nothing here compiles, and everything above it depends on it.',
    work: null, stack: [],
  },
  {
    code: 'CMSI 3300', slug: 'cmsi-3300', title: 'Artificial Intelligence', term: 'Fall 2024',
    blurb:
      'Probabilistic reasoning before anything else: Bayesian networks, decision networks that pick an action under uncertainty, and text classifiers trained on one corpus and graded against another they had never seen.',
    work: 'inference and classification', stack: ['Python', 'pgmpy', 'scikit-learn', 'NumPy', 'pytest'],
    highlights: [
      'Bayesian network inference with pgmpy',
      'A decision-network agent choosing under uncertainty',
      'Text classification scored against held-out data',
      'A recorded defect: ad_agent.py calls map_query on CausalInference, which has never had that method',
    ],
  },
  {
    code: 'CMSI 3550', slug: 'cmsi-3550', title: 'Networks and the Internet', term: 'Spring 2024',
    blurb:
      'Seven projects in Rust, working down the stack rather than reading about it: subnet arithmetic by hand, then sockets, then two peers moving a file between them with no server in the middle.',
    work: '7 projects, Rust', stack: ['Rust', 'Cargo', 'React', 'TCP/IP'],
    highlights: [
      'Subnet calculator — network, broadcast, usable range and CIDR, from bit operations',
      'Peer-to-peer file transfer over raw sockets, with a React front end',
      'Socket programming exercises across the transport layer',
    ],
  },
  {
    code: 'CMSI 3751', slug: 'cmsi-3751', title: 'Game Design', term: 'Fall 2023',
    blurb:
      'Mechanics, systems and level design, with playtesting treated as a method rather than a formality — the only course here where the failure mode is "technically works, nobody enjoys it".',
    work: null, stack: [],
  },
  {
    code: 'CMSI 3801', slug: 'cmsi-3801', title: 'Theories of Computer and Human Languages', term: 'Fall 2024',
    blurb:
      'One problem set, solved thirteen times in thirteen languages. The problems stop being the interesting part around the fourth language; what each language makes easy, awkward or impossible is the actual subject.',
    work: '13 languages', stack: [
      'C', 'C++', 'Python', 'JavaScript', 'TypeScript', 'Swift', 'Rust',
      'Go', 'Haskell', 'Kotlin', 'Lua', 'OCaml', 'Java',
    ],
    highlights: [
      'Same six exercises in every language, so the differences are the language',
      'Manual memory in C against garbage collection everywhere else',
      'Either in Haskell against exceptions in OCaml, for the identical function',
      'Six verified end to end: C, C++, Python, JavaScript, TypeScript and Swift',
    ],
  },
  {
    code: 'CMSI 3802', slug: 'cmsi-3802', title: 'Programming Language Concepts and Implementation', term: 'Spring 2025',
    blurb:
      'CloudScribe: a statically typed language for IT automation, compiled to JavaScript through five stages. An Ohm grammar parses, a semantic pass builds the typed representation and rejects what should not run, an optimiser folds what it can prove, and the generator emits.',
    work: 'CloudScribe compiler', stack: ['Ohm', 'JavaScript', 'Node', 'Mocha', 'c8'],
    highlights: [
      'Five stages: parse, analyse, optimise, generate, emit',
      '143 tests holding 99.66% statement coverage',
      'Seven example programs that compile and run',
      'Still developed in its own repository, 46 commits past the course snapshot',
    ],
  },
  {
    code: 'CMSI 3920', slug: 'cmsi-3920', title: 'Computing Contexts and Ethics', term: 'Summer 2024 I',
    blurb:
      'Who software affects, who it excludes, and who answers for it when it goes wrong. Appears only in the course audit, which is the other reason a directory count of this tree undercounts.',
    work: null, stack: [],
  },
  {
    code: 'CMSI 4071', slug: 'cmsi-4071', title: 'Senior Project I', term: 'Fall 2024',
    blurb:
      'The half of a capstone nobody puts in a portfolio: requirements, specification, architecture and a defended design review, all of it before a line of the thing exists. Built in CMSI 4072.',
    work: 'design and specification', stack: ['UML'],
  },
  {
    code: 'CMSI 4072', slug: 'cmsi-4072', title: 'Senior Project II', term: 'Spring 2025',
    blurb:
      'Pathfinder, built to the previous semester’s specification: career guidance that reads a student’s coursework and interests and proposes routes through them. Vite front end, Express API, Firebase Cloud Functions, shipped as a complete deliverable set.',
    work: 'Pathfinder', stack: ['React', 'Vite', 'Express', 'Firebase', 'Cloud Functions', 'Node'],
    highlights: [
      'Vite and React front end, deployable standalone',
      'Express API with Firebase Cloud Functions behind it',
      'Full deliverable set: specification, design, test plan, demonstration',
      'Continues privately as a product',
    ],
  },
];

export type LiveRepo = {
  /** How it is written for a reader. */
  name: string;
  /** How GitHub spells it. */
  repo: string;
  url: string;
  visibility: 'public' | 'private';
  blurb: string;
  from: string;
};

export const liveRepos: LiveRepo[] = [
  {
    name: 'CloudScribe', repo: 'cloudscribe',
    url: 'https://github.com/patrickking67/cloudscribe', visibility: 'public',
    blurb: 'The language and its five-stage compiler, still under development past the course snapshot.',
    from: 'CMSI 3802',
  },
  {
    name: 'Pathfinder', repo: 'pathfinder',
    url: 'https://github.com/patrickking67/pathfinder', visibility: 'private',
    blurb: 'The senior capstone, being rebuilt as a product rather than a deliverable.',
    from: 'CMSI 4072',
  },
  {
    name: 'myGainz', repo: 'myGainz',
    url: 'https://github.com/patrickking67/myGainz', visibility: 'public',
    blurb: 'A training log on React and Firestore, three years older than anything else still running.',
    from: 'CMSI 2021',
  },
];

/**
 * Languages and tools, weighted by how much was actually written in each —
 * 3 is sustained work across several courses, 1 is one project or one
 * exercise set. Exposure without code does not appear here at all.
 */
export type Tool = { name: string; weight: 1 | 2 | 3; where: string };

export const toolkit: Tool[] = [
  { name: 'JavaScript',   weight: 3, where: 'CMSI 2021, 3801, 3802, 4072' },
  { name: 'Java',         weight: 3, where: 'CMSI 2120, 2130, 3801' },
  { name: 'Python',       weight: 3, where: 'CMSI 1010, 3300, 3801' },
  { name: 'Rust',         weight: 3, where: 'CMSI 3550, 3801' },
  { name: 'React',        weight: 3, where: 'CMSI 2021, 3550, 4072' },
  { name: 'Node',         weight: 2, where: 'CMSI 3802, 4072' },
  { name: 'TypeScript',   weight: 2, where: 'CMSI 3801' },
  { name: 'C',            weight: 2, where: 'CMSI 2210, 3801' },
  { name: 'C++',          weight: 2, where: 'CMSI 3801' },
  { name: 'Ohm',          weight: 2, where: 'CMSI 3802' },
  { name: 'Firebase',     weight: 2, where: 'CMSI 2021, 4072' },
  { name: 'Firestore',    weight: 2, where: 'CMSI 2021, 4072' },
  { name: 'CSS',          weight: 2, where: 'CMSI 2021, 4072' },
  { name: 'Git',          weight: 2, where: 'every course with code' },
  { name: 'Swift',        weight: 1, where: 'CMSI 3801' },
  { name: 'Go',           weight: 1, where: 'CMSI 3801' },
  { name: 'Haskell',      weight: 1, where: 'CMSI 3801' },
  { name: 'Kotlin',       weight: 1, where: 'CMSI 3801' },
  { name: 'OCaml',        weight: 1, where: 'CMSI 3801' },
  { name: 'Lua',          weight: 1, where: 'CMSI 3801' },
  { name: 'Assembly',     weight: 1, where: 'CMSI 2210' },
  { name: 'Tailwind',     weight: 1, where: 'CMSI 2021' },
  { name: 'Vite',         weight: 1, where: 'CMSI 4072' },
  { name: 'Express',      weight: 1, where: 'CMSI 4072' },
  { name: 'Cloud Functions', weight: 1, where: 'CMSI 4072' },
  { name: 'scikit-learn', weight: 1, where: 'CMSI 3300' },
  { name: 'pgmpy',        weight: 1, where: 'CMSI 3300' },
  { name: 'NumPy',        weight: 1, where: 'CMSI 3300' },
  { name: 'JUnit',        weight: 1, where: 'CMSI 2130' },
  { name: 'Maven',        weight: 1, where: 'CMSI 2130' },
  { name: 'pytest',       weight: 1, where: 'CMSI 3300' },
  { name: 'Mocha',        weight: 1, where: 'CMSI 3802' },
  { name: 'Cargo',        weight: 1, where: 'CMSI 3550, 3801' },
  { name: 'Astro',        weight: 1, where: 'this site' },
];
