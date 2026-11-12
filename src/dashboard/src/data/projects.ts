/**
 * The three case studies: problem, approach, what was hard, what I would do
 * differently, and where the code is.
 *
 * Everything stated here is read from the code under src/courses, and every
 * path is checked against the tree by tests/site-data.test.mjs. Classmates on
 * the two team projects are not named; the submitted READMEs name them.
 */
export type Source = { label: string; path: string };

export type Project = {
  slug: 'cloudscribe' | 'network-stack' | 'pathfinder';
  name: string;
  /** One line under the title. */
  tagline: string;
  courses: string[];
  term: string;
  /** Who built it. Team size only, never names. */
  team: string;
  stack: string[];
  problem: string[];
  approach: { title: string; body: string }[];
  /** The one hard thing, in a sentence, then the detail. */
  hard: { summary: string; detail: string };
  /** What the architecture figure shows. */
  figure: string;
  /** Measured or directly readable facts. */
  facts: { value: string; label: string }[];
  differently: { title: string; body: string }[];
  sources: Source[];
  /** Anchor on the Programs page when it runs there. */
  program?: string;
  /** A live repository that continues it. */
  live?: string;
};

export const projects: Project[] = [
  {
    slug: 'cloudscribe',
    name: 'CloudScribe',
    tagline: 'A statically typed language for IT automation, and a compiler for it that runs in this page.',
    courses: ['CMSI 3802'],
    term: 'Spring 2025',
    team: 'Built with one partner',
    stack: ['JavaScript', 'Ohm', 'Node', 'c8'],
    problem: [
      'Automation scripts are quick to write and hard to trust. A misspelled variable in a shell script is found when the script runs, which is usually on a server and usually at a bad time.',
      'The course asks for a complete compiler for a language of your own design. CloudScribe is that language: scripting for provisioning and maintenance work, with a type checker in front so a bad script is rejected before it runs anything.',
    ],
    approach: [
      {
        title: 'Parse with a grammar that stands alone',
        body: 'The syntax is a 102-line Ohm grammar in its own file. Every alternative carries a case label, and each label becomes one small function in the analyzer instead of one branch of a large switch.',
      },
      {
        title: 'Analyze into a typed graph',
        body: 'The analyzer walks the match and builds nodes through constructors in core.js, attaching a type to each expression. A chain of Context objects holds the scope and three facts about where the walker is: inside a loop, inside a function, inside a task.',
      },
      {
        title: 'Optimize, then generate',
        body: 'The optimizer folds constant arithmetic, resolves a conditional whose test is a literal, and drops a while loop whose test is literally false. The generator emits JavaScript and renames every variable with a numeric suffix, so a CloudScribe name can never collide with a JavaScript keyword.',
      },
      {
        title: 'One entry point, four stops',
        body: 'compiler.js runs parse, analyze, optimize and generate in order and can return after any of them. The command line and the playground on this site both use that to show each stage.',
      },
    ],
    hard: {
      summary: 'Rejecting bad programs with a useful message, before any output exists.',
      detail:
        'Static checking is most of the compiler: 462 of the 1,040 lines in src. Each rule is a small must function that throws with the line and column Ohm recorded: a name declared twice, a break outside a loop, a return outside a function or task, a call with the wrong number of arguments, an operand of the wrong type. The flags have to survive nesting: a loop inside a function inside a task still knows all three.',
    },
    figure:
      'Four stages in a row. Solid arrows carry the program forward; dotted arrows are the ways out. The last one is a defect: the generator has no case for task.',
    facts: [
      { value: '143', label: 'tests passing, re-run 2026-11-11' },
      { value: '99.66%', label: 'statement coverage' },
      { value: '2', label: 'back-end defects the suite never reached' },
      { value: '7', label: 'example programs, none of which reach JavaScript' },
    ],
    differently: [
      {
        title: 'Compile the examples in the test suite',
        body: 'Every example program is wrapped in a task, and the generator has no case for one, so all seven fail at the last stage. One test that compiled each file in examples/ to JavaScript would have failed on the first run. The analyzer tests exercise task; the generator tests never mention it.',
      },
      {
        title: 'Make every optimizer visitor return a node',
        body: 'Four visitors fall off the end and return undefined when they have nothing to fold. The generator turns undefined into an empty string, so print(x + 1) compiles to console.log() and a while loop disappears. I would have each visitor return its input by default and have the generator throw on a missing node instead of printing nothing.',
      },
      {
        title: 'Stop reading statement coverage as correctness',
        body: 'Every broken function ran under test and returned the wrong thing. Coverage said 99.66% and was right. The generator tests only used literal arithmetic, which the optimizer folds before the generator sees it. Tests on variables, not constants, would have found both defects.',
      },
    ],
    sources: [
      { label: 'Grammar', path: 'src/courses/cmsi-3802/cloudscribe/src/cloudscribe.ohm' },
      { label: 'Analyzer', path: 'src/courses/cmsi-3802/cloudscribe/src/analyzer.js' },
      { label: 'Optimizer', path: 'src/courses/cmsi-3802/cloudscribe/src/optimizer.js' },
      { label: 'Generator', path: 'src/courses/cmsi-3802/cloudscribe/src/generator.js' },
      { label: 'Tests', path: 'src/courses/cmsi-3802/cloudscribe/test' },
      { label: 'Example programs', path: 'src/courses/cmsi-3802/cloudscribe/examples' },
      { label: 'The two defects, reproduced', path: 'docs/building.md' },
    ],
    program: 'cloudscribe',
    live: 'https://github.com/patrickking67/cloudscribe',
  },
  {
    slug: 'network-stack',
    name: 'The network stack',
    tagline: 'Seven Rust projects that end in a peer-to-peer trading card network with no server.',
    courses: ['CMSI 3550'],
    term: 'Spring 2024',
    team: 'Final project built in a team of three',
    stack: ['Rust', 'Tokio', 'libp2p', 'serde'],
    problem: [
      'The course works up from an address to an application. The early projects are small on purpose: print the machine’s local address, split an address into groups and validate them, and compute a subnet from an address and a prefix length using nothing but bit operations.',
      'The final project had to be a working networked application. Ours lets peers on the same network find each other, publish trading cards and list each other’s public cards, with no server in the middle.',
    ],
    approach: [
      {
        title: 'Subnet arithmetic from first principles',
        body: 'The mask is the complement of all ones shifted right by the prefix length. The network address is the address AND the mask; the broadcast address is the network OR the inverted mask. Everything else is one addition or subtraction on a 32-bit integer.',
      },
      {
        title: 'A transport built in layers',
        body: 'Each peer opens a TCP listener on a port the operating system picks. The connection is upgraded with a Noise XX handshake tied to the peer’s Ed25519 identity, then multiplexed with mplex so several streams share one socket.',
      },
      {
        title: 'Discovery and messaging as separate behaviours',
        body: 'mDNS finds peers on the local network and adds them to the publish and subscribe view. Floodsub carries the application messages on one topic, cards. The two are combined into a single libp2p behaviour.',
      },
      {
        title: 'One loop for three kinds of event',
        body: 'A single tokio::select! loop waits on a line from stdin, a response ready to send, and an event from the network. Commands list peers, list cards, create a card and publish one. Cards are stored in a JSON file next to the binary.',
      },
    ],
    hard: {
      summary: 'Getting request and response out of a protocol that only broadcasts.',
      detail:
        'Floodsub delivers every message to every subscriber and has no notion of a reply. A request to list cards therefore goes to everyone, and each answer carries the peer ID it is meant for; every peer receives every answer and drops the ones addressed to someone else. Responses are produced on a spawned task and handed back to the main loop over a channel, because the network behaviour cannot await a file read while it is handling an event.',
    },
    figure:
      'Read it from the bottom. Three transport layers, two libp2p behaviours on top of them, and the application loop that ties stdin, the card file and the network together.',
    facts: [
      { value: '7', label: 'Rust crates in the course directory' },
      { value: '663', label: 'lines of Rust across them' },
      { value: '335', label: 'lines in the final project’s main.rs' },
      { value: '0', label: 'servers between two peers' },
    ],
    differently: [
      {
        title: 'Use a request and response protocol for replies',
        body: 'Sending every reply to every peer works on a small local network and wastes traffic on a large one. libp2p has a request and response behaviour that opens a stream to one peer. Listing a single peer’s cards should use it, and the broadcast should be kept for announcements.',
      },
      {
        title: 'Connect the front end to the peer',
        body: 'The React app in the project keeps its cards in component state and never talks to the Rust process. I would expose the peer over a local WebSocket so the interface shows real peers and real cards.',
      },
      {
        title: 'Take input from the command line, and test it',
        body: 'The subnet calculator computes one hard-coded network, 157.242.0.0/16, and none of the crates has a test. The mask, network and broadcast functions are pure and would take a table of cases directly, including the /31 and /32 prefixes the usable-host arithmetic does not handle.',
      },
    ],
    sources: [
      { label: 'Peer-to-peer network, final version', path: 'src/courses/cmsi-3550/Final/src/main.rs' },
      { label: 'Its dependencies', path: 'src/courses/cmsi-3550/Final/Cargo.toml' },
      { label: 'Subnet calculator', path: 'src/courses/cmsi-3550/homework2_subcalc/src/main.rs' },
      { label: 'Local address lookup', path: 'src/courses/cmsi-3550/homework1_myip/src/main.rs' },
      { label: 'Earlier iteration of the peer', path: 'src/courses/cmsi-3550/cmsi3550-pgt-p2p/src/main.rs' },
      { label: 'React front end', path: 'src/courses/cmsi-3550/Final/p2p-app/src/App.js' },
    ],
  },
  {
    slug: 'pathfinder',
    name: 'Pathfinder',
    tagline: 'The senior project: a career guidance web app, specified in one semester and built in the next.',
    courses: ['CMSI 4071', 'CMSI 4072'],
    term: 'Fall 2024 to Spring 2025',
    team: 'Team of four; I was project manager',
    stack: ['React', 'Vite', 'Firebase Auth', 'Express', 'Cloud Functions'],
    problem: [
      'A student looking for a first job uses one tool for the resume, another for salary data, another for interview practice, and none of them knows anything about the student. Pathfinder puts those in one place behind a short questionnaire about background and goals.',
      'It was also an exercise in process. The first semester produced a proposal, a requirements specification and a design document, each reviewed and revised. The second semester built to those documents, with a test procedure and weekly status reports.',
    ],
    approach: [
      {
        title: 'Two gates, then five pages',
        body: 'App.jsx decides what a visitor sees. Not signed in: a Google sign-in through Firebase Auth. Signed in with no questionnaire: a three-step questionnaire. Otherwise the app itself, with Home, Chat, Tools, Resources and Settings behind a router.',
      },
      {
        title: 'One module for every model call',
        body: 'api.js holds the chat coach, the resume reviewer and the salary estimator. Each is the same chat completion request with a different system prompt, so the pages never build a prompt themselves.',
      },
      {
        title: 'Fail to something useful',
        body: 'If the model call fails, the app answers from a small set of canned replies chosen by keyword, and if that fails it asks the user to rephrase, so a demonstration never ends on an error.',
      },
      {
        title: 'A server side that checks who is asking',
        body: 'The Express API verifies a Firebase ID token on every protected route before reading the user’s document from Firestore. Two Cloud Functions proxy a chat API and a job search API so their key stays off the client.',
      },
    ],
    hard: {
      summary: 'Building what the specification said, with four people, on a fixed date.',
      detail:
        'The design was written a semester before the code, then reviewed and revised. The tree shows where the build stopped short of it: the server pieces exist on their own, but the front end that shipped talks to the model directly and keeps the questionnaire in the browser.',
    },
    figure:
      'What the submitted code does. The browser reaches Firebase Auth and the model. The Express API and the Cloud Functions are in the tree with no caller in the front end.',
    facts: [
      { value: '2', label: 'semesters: specify, then build' },
      { value: '4', label: 'people on the team' },
      { value: '5', label: 'pages behind the sign-in and questionnaire gates' },
      { value: '7', label: 'deliverable documents, proposal to test procedure' },
    ],
    differently: [
      {
        title: 'Keep the model key on the server',
        body: 'The front end constructs the OpenAI client in the browser with the option that allows it, so a real key would ship to every visitor. The Express API already verifies ID tokens. The model call belongs behind it.',
      },
      {
        title: 'Wire the pieces together',
        body: 'Nothing in the front end calls the Express API or the Cloud Functions, and the questionnaire is saved to localStorage, so a profile does not follow its owner to another device. The Firestore user document the API reads is where it should live.',
      },
      {
        title: 'Never commit a secret, even once',
        body: 'Two credentials were committed during the project and later removed from the history of this repository. Reading every key from the environment from the first commit costs nothing and avoids the cleanup.',
      },
      {
        title: 'Replace the placeholders, and test',
        body: 'The salary range and the job match percentages on the home page are constants. The test procedure was a written document run by hand. A handful of component tests on the two gates would have covered the logic most likely to break.',
      },
    ],
    sources: [
      { label: 'The two gates', path: 'src/courses/cmsi-4072/Pathfinder/frontend/src/App.jsx' },
      { label: 'Model calls and fallbacks', path: 'src/courses/cmsi-4072/Pathfinder/frontend/src/api.js' },
      { label: 'Questionnaire', path: 'src/courses/cmsi-4072/Pathfinder/frontend/src/pages/Questionnaire.jsx' },
      { label: 'Express API', path: 'src/courses/cmsi-4072/Pathfinder/backend/index.js' },
      { label: 'Cloud Functions', path: 'src/courses/cmsi-4072/Pathfinder/backend/functions/index.js' },
      { label: 'Specification and design documents', path: 'src/courses/cmsi-4072/Senior Project Deliverables' },
    ],
  },
];
