/**
 * The fifteen CMSI courses. Terms come from the author's course audit.
 * Titles are the LMU Academic Bulletin titles.
 *
 * Grades are deliberately absent. They live in docs/record.md; this is a
 * portfolio surface and does not repeat them.
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
    blurb: 'Where it started: control flow, functions, and the habit of testing things.', work: null, stack: [] },
  { code: 'CMSI 1900', slug: 'cmsi-1900', title: 'Exploring Computer Science', term: 'Fall 2021',
    blurb: 'First-year seminar on what the field actually contains.', work: null, stack: [] },
  { code: 'CMSI 2021', slug: 'cmsi-2021', title: 'Web Application Development', term: 'Fall 2022',
    blurb: 'Four front ends built end to end, including myGainz — a fitness tracker that is still running.',
    work: 'myGainz and 3 web apps', stack: ['React', 'Firebase', 'Tailwind'] },
  { code: 'CMSI 2120', slug: 'cmsi-2120', title: 'Data Structures and Applications', term: 'Spring 2022',
    blurb: 'Lists, trees, hash tables, graphs, and the cost of choosing wrong.', work: null, stack: [] },
  { code: 'CMSI 2130', slug: 'cmsi-2130', title: 'Algorithms and Analysis', term: 'Spring 2023',
    blurb: 'A* pathfinding, constraint satisfaction, Huffman compression, edit distance, and adversarial search — five projects, 27 Java sources.',
    work: '5 projects, 27 Java sources', stack: ['Java', 'JUnit'] },
  { code: 'CMSI 2210', slug: 'cmsi-2210', title: 'Computer Systems Organization', term: 'Fall 2022',
    blurb: 'Assembly, memory layout, and what the hardware is really doing.', work: null, stack: [] },
  { code: 'CMSI 2820', slug: 'cmsi-2820', title: 'Discrete Mathematics for Computer Science', term: 'Fall 2022',
    blurb: 'Logic, proof, combinatorics, and graph theory — the maths the rest of it rests on.', work: null, stack: [] },
  { code: 'CMSI 3300', slug: 'cmsi-3300', title: 'Artificial Intelligence', term: 'Fall 2024',
    blurb: 'Bayesian networks, decision networks under uncertainty, and text classifiers trained and graded against unseen data.',
    work: 'inference and classification', stack: ['Python', 'pgmpy', 'scikit-learn'] },
  { code: 'CMSI 3550', slug: 'cmsi-3550', title: 'Networks and the Internet', term: 'Spring 2024',
    blurb: 'Subnet calculators, peer-to-peer file transfer, and raw socket programming — seven projects, written in Rust.',
    work: '7 projects', stack: ['Rust', 'React'] },
  { code: 'CMSI 3751', slug: 'cmsi-3751', title: 'Game Design', term: 'Fall 2023',
    blurb: 'Mechanics, level design, and playtesting as a discipline.', work: null, stack: [] },
  { code: 'CMSI 3801', slug: 'cmsi-3801', title: 'Theories of Computer and Human Languages', term: 'Fall 2024',
    blurb: 'The same problem set solved thirteen times over, in thirteen languages — from C to Haskell to OCaml.',
    work: '13 languages', stack: ['C', 'C++', 'Python', 'JavaScript', 'TypeScript', 'Swift', 'Rust', 'Go', 'Haskell', 'Kotlin', 'Lua', 'OCaml', 'Java'] },
  { code: 'CMSI 3802', slug: 'cmsi-3802', title: 'Programming Language Concepts and Implementation', term: 'Spring 2025',
    blurb: 'cloudscribe: a statically typed language for IT automation that compiles to JavaScript. Five-stage compiler, 143 tests, 99.66% statement coverage.',
    work: 'cloudscribe compiler', stack: ['Ohm', 'JavaScript', 'Node'] },
  { code: 'CMSI 3920', slug: 'cmsi-3920', title: 'Computing Contexts and Ethics', term: 'Summer 2024 I',
    blurb: 'Who software affects, and who answers for it.', work: null, stack: [] },
  { code: 'CMSI 4071', slug: 'cmsi-4071', title: 'Senior Project I', term: 'Fall 2024',
    blurb: 'Requirements, specification, and system design for the capstone. Built in CMSI 4072.',
    work: 'design and specification', stack: [] },
  { code: 'CMSI 4072', slug: 'cmsi-4072', title: 'Senior Project II', term: 'Spring 2025',
    blurb: 'Pathfinder: an AI career-guidance platform. Vite front end, Express and Firebase Cloud Functions behind it, shipped as a full deliverable set.',
    work: 'Pathfinder', stack: ['React', 'Vite', 'Express', 'Firebase'] },
];

export const liveRepos = [
  { name: 'cloudscribe', url: 'https://github.com/patrickking67/cloudscribe', visibility: 'public',
    blurb: 'A statically typed language for IT automation, compiling to JavaScript. Started in CMSI 3802 and still in development.' },
  { name: 'pathfinder', url: 'https://github.com/patrickking67/pathfinder', visibility: 'private',
    blurb: 'The senior capstone, being rebuilt as a product.' },
  { name: 'myGainz', url: 'https://github.com/patrickking67/myGainz', visibility: 'public',
    blurb: 'Fitness tracker. React and Firestore.' },
];

/** Every language and tool used across the coursework, weighted by depth. */
export const toolkit: { name: string; weight: 1 | 2 | 3; where: string }[] = [
  { name: 'JavaScript', weight: 3, where: 'CMSI 2021, 3801, 3802, 4072' },
  { name: 'Python',     weight: 3, where: 'CMSI 3300, 3801' },
  { name: 'Java',       weight: 3, where: 'CMSI 2130, 3801' },
  { name: 'Rust',       weight: 3, where: 'CMSI 3550, 3801' },
  { name: 'React',      weight: 3, where: 'CMSI 2021, 3550, 4072' },
  { name: 'TypeScript', weight: 2, where: 'CMSI 3801' },
  { name: 'C',          weight: 2, where: 'CMSI 3801' },
  { name: 'C++',        weight: 2, where: 'CMSI 3801' },
  { name: 'Ohm',        weight: 2, where: 'CMSI 3802' },
  { name: 'Firebase',   weight: 2, where: 'CMSI 2021, 4072' },
  { name: 'Node',       weight: 2, where: 'CMSI 3802, 4072' },
  { name: 'Swift',      weight: 1, where: 'CMSI 3801' },
  { name: 'Go',         weight: 1, where: 'CMSI 3801' },
  { name: 'Haskell',    weight: 1, where: 'CMSI 3801' },
  { name: 'Kotlin',     weight: 1, where: 'CMSI 3801' },
  { name: 'OCaml',      weight: 1, where: 'CMSI 3801' },
  { name: 'Lua',        weight: 1, where: 'CMSI 3801' },
  { name: 'Tailwind',   weight: 1, where: 'CMSI 2021' },
  { name: 'Vite',       weight: 1, where: 'CMSI 4072' },
  { name: 'Express',    weight: 1, where: 'CMSI 4072' },
  { name: 'scikit-learn', weight: 1, where: 'CMSI 3300' },
  { name: 'JUnit',      weight: 1, where: 'CMSI 2130' },
];
