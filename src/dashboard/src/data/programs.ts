/**
 * The programs, and how each one runs in the browser.
 *
 * `embed` is the honest part. A program is only marked runnable if it will
 * actually boot inside this page:
 *
 *   inline      the whole thing is a few static files, so they are read at
 *               build time and handed to a sandboxed iframe as srcdoc
 *   container   a StackBlitz WebContainer boots the public repository and runs
 *               npm install and the dev server inside the browser tab
 *   source      nothing runs here — a native toolchain, a private repository,
 *               or credentials that are nobody's business but the owner's
 *
 * Nothing on this page asks you to clone anything.
 */
export type Program = {
  name: string;
  course: string;
  path: string;
  blurb: string;
  stack: string[];
  embed: 'inline' | 'container' | 'source';
  /** owner/repo, for container embeds. The repository must be public. */
  repo?: string;
  /** What the container should open on first paint. */
  file?: string;
  source?: string;
  note?: string;
};

export const programs: Program[] = [
  {
    name: 'CloudScribe',
    course: 'CMSI 3802',
    path: 'src/courses/cmsi-3802/cloudscribe',
    blurb:
      'A statically typed language for the kind of work that usually ends up in a fragile shell script — provisioning, deployment, scheduled jobs. It compiles to JavaScript through five stages: an Ohm grammar parses, a semantic pass builds the typed representation and rejects the programs that should not run, an optimiser folds what it can prove, and the generator emits. 143 tests hold it to 99.66% statement coverage.',
    stack: ['Ohm', 'JavaScript', 'Node 20'],
    embed: 'container',
    repo: 'patrickking67/cloudscribe',
    file: 'src/cloudscribe.js',
    source: 'https://github.com/patrickking67/cloudscribe',
    note: 'The container installs and runs the test suite. Give it a moment on first boot.',
  },
  {
    name: 'myGainz',
    course: 'CMSI 2021',
    path: 'src/courses/cmsi-2021/myGainz/mygainz',
    blurb:
      'A training log that keeps the set-by-set history a workout app usually throws away. React on the front, Firebase Auth for accounts, Firestore underneath so the same log follows you between devices.',
    stack: ['React', 'Firebase', 'Tailwind'],
    embed: 'container',
    repo: 'patrickking67/myGainz',
    file: 'src/App.js',
    source: 'https://github.com/patrickking67/myGainz',
    note: 'The interface boots and browses. Signing in needs a Firebase project of your own — the committed config points nowhere.',
  },
  {
    name: 'Compound Interest Calculator',
    course: 'CMSI 2021',
    path: 'src/courses/cmsi-2021/Compound-Interest-Calculator',
    blurb:
      'Four inputs and two outputs, recomputed on every keystroke. No framework, no build step, no dependency — one HTML file, one stylesheet, one script, which is the entire point of where it sits in the curriculum.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    embed: 'inline',
    note:
      'Running exactly as submitted, save for one thing: the markup asks for interest.jpg where the file is Interest.jpeg, so the embed resolves the image rather than showing a broken one.',
  },
  {
    name: 'Peer-to-peer file transfer',
    course: 'CMSI 3550',
    path: 'src/courses/cmsi-3550/Final',
    blurb:
      'File transfer with no server in the middle. Two peers find each other, open a socket, and move bytes directly; the Rust side handles framing and the transfer loop, and a React front end sits on top of it.',
    stack: ['Rust', 'React'],
    embed: 'source',
    note: 'Raw sockets and a native toolchain. Neither survives a browser sandbox.',
  },
  {
    name: 'Subnet calculator',
    course: 'CMSI 3550',
    path: 'src/courses/cmsi-3550/homework2_subcalc',
    blurb:
      'Give it an address and a mask and it returns the network and broadcast addresses, the usable host range, and the CIDR form — the arithmetic you do by hand once and then never want to again.',
    stack: ['Rust'],
    embed: 'source',
    note: 'Compiled Rust. Needs cargo.',
  },
  {
    name: 'Pathfinder',
    course: 'CMSI 4072',
    path: 'src/courses/cmsi-4072/Pathfinder',
    blurb:
      'The senior capstone: career guidance that reads a student’s coursework and interests and proposes routes through them. A Vite front end, an Express API, and Firebase Cloud Functions behind that.',
    stack: ['React', 'Vite', 'Express', 'Firebase'],
    embed: 'source',
    note: 'The backend wants a service account that is deliberately not in this repository, and the working version is private.',
  },
  {
    name: 'Blog Application',
    course: 'CMSI 2021',
    path: 'src/courses/cmsi-2021/Blog-Application',
    blurb:
      'Multi-user blogging with real accounts: sign-up, sign-in, and posts owned by whoever wrote them, stored in Firestore and readable by everyone else.',
    stack: ['React', 'Firebase'],
    embed: 'source',
    note: 'Same as myGainz — it needs a Firebase project pointed at it.',
  },
  {
    name: 'Artist Data API',
    course: 'CMSI 2021',
    path: 'src/courses/cmsi-2021/Artist-Data-API',
    blurb:
      'Type a musician’s name and it queries MusicBrainz, disambiguates the result, and lays out the catalogue — releases, dates, and the aliases the same artist has recorded under.',
    stack: ['React', 'MusicBrainz'],
    embed: 'source',
    note: 'Lives in this repository, which is not public, so no container can reach it.',
  },
  {
    name: 'Thirteen-language exercise set',
    course: 'CMSI 3801',
    path: 'src/courses/cmsi-3801',
    blurb:
      'One problem set, solved thirteen times over — C, C++, Python, JavaScript, TypeScript, Swift, Rust, Go, Haskell, Kotlin, Lua, OCaml and Java. The problems stop being the interesting part around the fourth language; what each one makes easy or impossible is.',
    stack: ['13 languages'],
    embed: 'source',
    note: 'Thirteen toolchains. Six were verified end to end; the commands are in docs/building.md.',
  },
];
