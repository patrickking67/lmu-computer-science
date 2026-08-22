/**
 * The fifteen CMSI courses. Terms come from the author's course audit, never
 * from an instructor course page — all four checked disagreed with the
 * enrollment term. Titles are the LMU Academic Bulletin titles.
 *
 * Grades are deliberately absent. They live in docs/record.md, which is the
 * authoritative record; this is a showcase surface and does not repeat them.
 */
export type Course = {
  code: string;
  slug: string;
  title: string;
  term: string;
  blurb: string;
  work: string | null;
  stack: string[];
};

export const courses: Course[] = [
  { code: 'CMSI 1010', slug: 'cmsi-1010', title: 'Computer Programming Laboratory', term: 'Fall 2021',
    blurb: 'First programming course. No repository survived.', work: null, stack: [] },
  { code: 'CMSI 1900', slug: 'cmsi-1900', title: 'Exploring Computer Science', term: 'Fall 2021',
    blurb: 'Zero-unit seminar. Produced no artifacts by design.', work: null, stack: [] },
  { code: 'CMSI 2021', slug: 'cmsi-2021', title: 'Web Application Development', term: 'Fall 2022',
    blurb: 'Four front ends, including myGainz — a fitness tracker still live today.',
    work: 'myGainz and 3 web apps', stack: ['React', 'Firebase', 'Tailwind'] },
  { code: 'CMSI 2120', slug: 'cmsi-2120', title: 'Data Structures and Applications', term: 'Spring 2022',
    blurb: 'Repository deleted before any local clone existed.', work: null, stack: [] },
  { code: 'CMSI 2130', slug: 'cmsi-2130', title: 'Algorithms and Analysis', term: 'Spring 2023',
    blurb: 'A*, constraint satisfaction, Huffman coding, edit distance, adversarial search.',
    work: '5 projects, 27 Java sources', stack: ['Java', 'JUnit'] },
  { code: 'CMSI 2210', slug: 'cmsi-2210', title: 'Computer Systems Organization', term: 'Fall 2022',
    blurb: 'Repository deleted before any local clone existed.', work: null, stack: [] },
  { code: 'CMSI 2820', slug: 'cmsi-2820', title: 'Discrete Mathematics for Computer Science', term: 'Fall 2022',
    blurb: 'No repository was ever created.', work: null, stack: [] },
  { code: 'CMSI 3300', slug: 'cmsi-3300', title: 'Artificial Intelligence', term: 'Fall 2024',
    blurb: 'Bayesian networks, decision networks, classifiers. Solutions survive only as git bundles.',
    work: 'course material, graded harnesses', stack: ['Python', 'pgmpy', 'scikit-learn'] },
  { code: 'CMSI 3550', slug: 'cmsi-3550', title: 'Networks and the Internet', term: 'Spring 2024',
    blurb: 'Subnet calculators, peer-to-peer file transfer, socket programming — in Rust.',
    work: '7 projects', stack: ['Rust', 'React'] },
  { code: 'CMSI 3751', slug: 'cmsi-3751', title: 'Game Design', term: 'Fall 2023',
    blurb: 'No repository was preserved.', work: null, stack: [] },
  { code: 'CMSI 3801', slug: 'cmsi-3801', title: 'Theories of Computer and Human Languages', term: 'Fall 2024',
    blurb: 'The same exercises implemented across thirteen languages, from C to OCaml to Kotlin.',
    work: '13 languages', stack: ['C', 'C++', 'Python', 'JS', 'TS', 'Swift', 'Rust', 'Go', 'Haskell', 'Kotlin', 'Lua', 'OCaml', 'Java'] },
  { code: 'CMSI 3802', slug: 'cmsi-3802', title: 'Programming Language Concepts and Implementation', term: 'Spring 2025',
    blurb: 'cloudscribe: a statically typed language for IT automation that compiles to JavaScript. Five-stage Ohm compiler, 99.66% statement coverage.',
    work: 'cloudscribe compiler', stack: ['Ohm', 'JavaScript', 'Node'] },
  { code: 'CMSI 3920', slug: 'cmsi-3920', title: 'Computing Contexts and Ethics', term: 'Summer 2024 I',
    blurb: 'Writing-based; nothing committed.', work: null, stack: [] },
  { code: 'CMSI 4071', slug: 'cmsi-4071', title: 'Senior Project I', term: 'Fall 2024',
    blurb: 'Requirements and design phase. Deliverables are filed under CMSI 4072.',
    work: 'see CMSI 4072', stack: [] },
  { code: 'CMSI 4072', slug: 'cmsi-4072', title: 'Senior Project II', term: 'Spring 2025',
    blurb: 'Pathfinder: an AI career-guidance platform. React + Vite front end, Firebase Cloud Functions back end.',
    work: 'Pathfinder, full deliverable set', stack: ['React', 'Vite', 'Firebase', 'Express'] },
];

export const liveRepos = [
  { name: 'cloudscribe', url: 'https://github.com/patrickking67/cloudscribe', visibility: 'public',
    blurb: 'Statically typed language for IT automation, compiling to JavaScript. Grew out of CMSI 3802 and is still developed.' },
  { name: 'pathfinder', url: 'https://github.com/patrickking67/pathfinder', visibility: 'private',
    blurb: 'The CMSI 4072 senior project, being rebuilt as a personal product.' },
  { name: 'myGainz', url: 'https://github.com/patrickking67/myGainz', visibility: 'public',
    blurb: 'Fitness tracker from CMSI 2021.' },
];
