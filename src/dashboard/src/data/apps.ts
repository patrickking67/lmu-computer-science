/**
 * Runnable projects, with the command that actually starts each one.
 *
 * Commands were verified on 2026-08-22. Where a project needs credentials or a
 * toolchain that is not bundled, it says so — an app listed as runnable that
 * is not would be worse than no listing at all.
 */
export type App = {
  name: string;
  course: string;
  path: string;
  blurb: string;
  stack: string[];
  run: string[];
  status: 'runs' | 'needs-setup';
  note?: string;
  live?: string;
};

export const apps: App[] = [
  {
    name: 'cloudscribe',
    course: 'CMSI 3802',
    path: 'src/courses/cmsi-3802/cloudscribe',
    blurb: 'A statically typed language for IT automation that compiles to JavaScript. Five stages: parse, analyse, optimise, generate, emit.',
    stack: ['Ohm', 'JavaScript', 'Node 20+'],
    run: ['cd src/courses/cmsi-3802/cloudscribe', 'npm install', 'npm test', 'node src/cloudscribe.js examples/hello.cs'],
    status: 'runs',
    note: '143 tests pass, 99.66% statement coverage.',
    live: 'https://github.com/patrickking67/cloudscribe',
  },
  {
    name: 'myGainz',
    course: 'CMSI 2021',
    path: 'src/courses/cmsi-2021/myGainz/mygainz',
    blurb: 'Fitness tracker. React front end on Firebase Auth and Firestore.',
    stack: ['React', 'Firebase', 'Tailwind'],
    run: ['cd src/courses/cmsi-2021/myGainz/mygainz', 'npm install', 'npm start'],
    status: 'needs-setup',
    note: 'Point it at a Firebase project of your own; the committed config is inert.',
    live: 'https://github.com/patrickking67/myGainz',
  },
  {
    name: 'Pathfinder',
    course: 'CMSI 4072',
    path: 'src/courses/cmsi-4072/Pathfinder',
    blurb: 'AI career-guidance platform. Vite front end, Express and Firebase Cloud Functions behind it. The senior capstone.',
    stack: ['React', 'Vite', 'Express', 'Firebase'],
    run: ['cd src/courses/cmsi-4072/Pathfinder/frontend', 'npm install', 'npm run dev'],
    status: 'needs-setup',
    note: 'Front end runs standalone. The backend wants your own Firebase service account and API keys.',
  },
  {
    name: 'Blog Application',
    course: 'CMSI 2021',
    path: 'src/courses/cmsi-2021/Blog-Application',
    blurb: 'Multi-user blog with authentication and Firestore-backed posts.',
    stack: ['React', 'Firebase'],
    run: ['cd src/courses/cmsi-2021/Blog-Application', 'npm install', 'npm start'],
    status: 'needs-setup',
    note: 'Same as myGainz: bring your own Firebase project.',
  },
  {
    name: 'Compound Interest Calculator',
    course: 'CMSI 2021',
    path: 'src/courses/cmsi-2021/Compound-Interest-Calculator',
    blurb: 'Plain HTML, CSS and JavaScript. No build step, no dependencies.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    run: ['cd src/courses/cmsi-2021/Compound-Interest-Calculator', 'npx serve .'],
    status: 'runs',
  },
  {
    name: 'Artist Data API',
    course: 'CMSI 2021',
    path: 'src/courses/cmsi-2021/Artist-Data-API',
    blurb: 'Queries the MusicBrainz API and renders an artist’s catalogue.',
    stack: ['React'],
    run: ['cd src/courses/cmsi-2021/Artist-Data-API', 'npm install', 'npm start'],
    status: 'runs',
  },
  {
    name: 'Peer-to-peer file transfer',
    course: 'CMSI 3550',
    path: 'src/courses/cmsi-3550/Final',
    blurb: 'Direct file transfer between peers over raw sockets, with a React front end on top.',
    stack: ['Rust', 'React'],
    run: ['cd src/courses/cmsi-3550/Final', 'cargo run', '# then, separately:', 'cd p2p-app && npm install && npm start'],
    status: 'needs-setup',
    note: 'Needs a Rust toolchain.',
  },
  {
    name: 'Subnet calculator',
    course: 'CMSI 3550',
    path: 'src/courses/cmsi-3550/homework2_subcalc',
    blurb: 'Works out network and broadcast addresses, usable host ranges, and CIDR conversions.',
    stack: ['Rust'],
    run: ['cd src/courses/cmsi-3550/homework2_subcalc', 'cargo run'],
    status: 'needs-setup',
    note: 'Needs a Rust toolchain.',
  },
  {
    name: 'Thirteen-language exercise set',
    course: 'CMSI 3801',
    path: 'src/courses/cmsi-3801',
    blurb: 'One problem set, solved thirteen times: C, C++, Python, JavaScript, TypeScript, Swift, Rust, Go, Haskell, Kotlin, Lua, OCaml and Java.',
    stack: ['13 languages'],
    run: ['cd src/courses/cmsi-3801/python && python3 -m unittest -q exercises_test', 'cd ../javascript && node --test exercises.test.js', 'cd ../c && gcc -o /tmp/t string_stack.c string_stack_test.c && /tmp/t'],
    status: 'runs',
    note: 'Six verified end to end — C, C++, Python, JavaScript, TypeScript and Swift. The rest need their own toolchains installed.',
  },
];
