/**
 * The architecture figures, as boxes and arrows.
 *
 * components/Figure.astro draws these as inline SVG at build time. Each one
 * is the site's version of a Mermaid diagram in docs/architecture.md and
 * says the same thing; file names here are checked against the tree by
 * tests/site-data.test.mjs.
 */
export type Side = 't' | 'b' | 'l' | 'r';

export type FigureNode = {
  id: string;
  x: number; y: number; w: number; h: number;
  title: string;
  /** Second and third lines, set smaller. */
  sub?: string[];
  /** Set the title in the mono face: it is a file name or an identifier. */
  mono?: boolean;
  /** quiet: an outside party. fault: a recorded defect. solid: the result. */
  kind?: 'quiet' | 'fault' | 'solid';
  /** Repository path this box stands for, when it stands for one. */
  path?: string;
};

export type FigureEdge = {
  from: string; fromSide: Side;
  to: string; toSide: Side;
  label?: string;
  dashed?: boolean;
  /** Arrowheads at both ends. */
  both?: boolean;
  labelDx?: number; labelDy?: number;
};

export type Figure = {
  id: string;
  title: string;
  /** What a screen reader gets instead of the drawing. */
  desc: string;
  width: number; height: number;
  groups?: { x: number; y: number; w: number; h: number; label: string }[];
  nodes: FigureNode[];
  edges: FigureEdge[];
};

const cs = 'src/courses/cmsi-3802/cloudscribe/src';
const p2p = 'src/courses/cmsi-3550/Final';
const pf = 'src/courses/cmsi-4072/Pathfinder';

export const figures: Record<'cloudscribe' | 'network-stack' | 'pathfinder' | 'site', Figure> = {
  cloudscribe: {
    id: 'fig-cloudscribe',
    title: 'The CloudScribe compiler pipeline',
    desc:
      'Source text goes through parser.js, analyzer.js, optimizer.js and generator.js to JavaScript. The parser can exit with a syntax error and the analyzer with a semantic error. Two recorded defects: four optimizer visitors return undefined, and the generator has no case for task.',
    width: 600, height: 540,
    nodes: [
      { id: 'src', x: 30, y: 20, w: 250, h: 44, title: 'source text (.csc)' },
      { id: 'parse', x: 30, y: 96, w: 250, h: 62, title: 'parser.js', mono: true, sub: ['Ohm match against cloudscribe.ohm'], path: `${cs}/parser.js` },
      { id: 'analyze', x: 30, y: 190, w: 250, h: 62, title: 'analyzer.js', mono: true, sub: ['scope chain, types, static rules;', 'nodes built by core.js'], path: `${cs}/analyzer.js` },
      { id: 'optimize', x: 30, y: 284, w: 250, h: 62, title: 'optimizer.js', mono: true, sub: ['folds constants and', 'literal conditionals'], path: `${cs}/optimizer.js` },
      { id: 'generate', x: 30, y: 378, w: 250, h: 62, title: 'generator.js', mono: true, sub: ['emits JavaScript,', 'renames every variable'], path: `${cs}/generator.js` },
      { id: 'js', x: 30, y: 476, w: 250, h: 44, title: 'JavaScript', kind: 'solid' },
      { id: 'e1', x: 380, y: 96, w: 200, h: 62, title: 'Syntax error', sub: ['Ohm’s own message'], kind: 'quiet' },
      { id: 'e2', x: 380, y: 190, w: 200, h: 62, title: 'Semantic error', sub: ['with line and column'], kind: 'quiet' },
      { id: 'e3', x: 380, y: 284, w: 200, h: 62, title: 'Defect', sub: ['four visitors return', 'undefined'], kind: 'fault' },
      { id: 'e4', x: 380, y: 378, w: 200, h: 62, title: 'Defect', sub: ['no case for task: every', 'example stops here'], kind: 'fault' },
    ],
    edges: [
      { from: 'src', fromSide: 'b', to: 'parse', toSide: 't' },
      { from: 'parse', fromSide: 'b', to: 'analyze', toSide: 't', label: 'match', labelDx: 28, labelDy: 10 },
      { from: 'analyze', fromSide: 'b', to: 'optimize', toSide: 't', label: 'typed graph', labelDx: 44, labelDy: 10 },
      { from: 'optimize', fromSide: 'b', to: 'generate', toSide: 't', label: 'rewritten graph', labelDx: 54, labelDy: 10 },
      { from: 'generate', fromSide: 'b', to: 'js', toSide: 't' },
      { from: 'parse', fromSide: 'r', to: 'e1', toSide: 'l', label: 'no match', dashed: true },
      { from: 'analyze', fromSide: 'r', to: 'e2', toSide: 'l', label: 'rule broken', dashed: true },
      { from: 'optimize', fromSide: 'r', to: 'e3', toSide: 'l', label: 'cannot fold', dashed: true },
      { from: 'generate', fromSide: 'r', to: 'e4', toSide: 'l', label: 'uses task', dashed: true },
    ],
  },

  'network-stack': {
    id: 'fig-network',
    title: 'The peer-to-peer card network, by layer',
    desc:
      'Three layers. Transport at the bottom: TCP, then a Noise XX handshake, then mplex multiplexing. Above it two libp2p behaviours: Floodsub messaging on the cards topic, fed with peers by mDNS discovery. At the top the application: stdin commands and a card file joined by one tokio select loop that publishes to and receives from Floodsub.',
    width: 600, height: 556,
    groups: [
      { x: 20, y: 16, w: 560, h: 126, label: 'Application' },
      { x: 20, y: 190, w: 560, h: 126, label: 'libp2p behaviours' },
      { x: 20, y: 364, w: 560, h: 176, label: 'Transport, bottom up' },
    ],
    nodes: [
      { id: 'cli', x: 40, y: 50, w: 160, h: 76, title: 'stdin', mono: true, sub: ['ls p, ls c,', 'create c, publish c'] },
      { id: 'loop', x: 220, y: 50, w: 160, h: 76, title: 'Event loop', sub: ['tokio::select!'], path: `${p2p}/src/main.rs` },
      { id: 'store', x: 400, y: 50, w: 160, h: 76, title: 'cards.json', mono: true, sub: ['local card store'], path: `${p2p}/cards.json` },
      { id: 'floodsub', x: 220, y: 224, w: 160, h: 76, title: 'Floodsub', sub: ['topic: cards', 'JSON request, response'] },
      { id: 'mdns', x: 400, y: 224, w: 160, h: 76, title: 'mDNS', sub: ['peer discovery', 'by multicast'] },
      { id: 'mplex', x: 40, y: 398, w: 520, h: 38, title: 'mplex: many streams on one connection' },
      { id: 'noise', x: 40, y: 442, w: 520, h: 38, title: 'Noise XX: handshake tied to the peer’s Ed25519 identity' },
      { id: 'tcp', x: 40, y: 486, w: 520, h: 38, title: 'TCP: a listener on a port the OS picks' },
    ],
    edges: [
      { from: 'cli', fromSide: 'r', to: 'loop', toSide: 'l' },
      { from: 'loop', fromSide: 'r', to: 'store', toSide: 'l', both: true },
      { from: 'loop', fromSide: 'b', to: 'floodsub', toSide: 't', label: 'publish, receive', both: true, labelDx: 58, labelDy: 10 },
      { from: 'mdns', fromSide: 'l', to: 'floodsub', toSide: 'r' },
      { from: 'floodsub', fromSide: 'b', to: 'mplex', toSide: 't', both: true },
    ],
  },

  pathfinder: {
    id: 'fig-pathfinder',
    title: 'Pathfinder components, as submitted',
    desc:
      'In the browser, App.jsx gates on sign-in and then on the questionnaire before showing five pages. The pages use api.js for model calls and localStorage for questionnaire answers. App.jsx reaches Firebase Auth and api.js reaches OpenAI. Separately in the tree, an Express API reads Firestore and two Cloud Functions proxy RapidAPI; nothing in the front end calls either.',
    width: 600, height: 560,
    groups: [
      { x: 20, y: 16, w: 350, h: 300, label: 'Browser: Vite and React' },
      { x: 20, y: 350, w: 350, h: 194, label: 'In the tree, with no caller in the front end' },
    ],
    nodes: [
      { id: 'gate', x: 40, y: 50, w: 310, h: 60, title: 'App.jsx', mono: true, sub: ['sign-in gate, then questionnaire gate'], path: `${pf}/frontend/src/App.jsx` },
      { id: 'pages', x: 40, y: 146, w: 310, h: 60, title: 'Five pages', sub: ['Home, Chat, Tools, Resources, Settings'], path: `${pf}/frontend/src/pages` },
      { id: 'local', x: 40, y: 240, w: 150, h: 60, title: 'localStorage', mono: true, sub: ['questionnaire answers'] },
      { id: 'api', x: 200, y: 240, w: 150, h: 60, title: 'api.js', mono: true, sub: ['model calls, canned', 'replies on failure'], path: `${pf}/frontend/src/api.js` },
      { id: 'auth', x: 420, y: 50, w: 160, h: 60, title: 'Firebase Auth', sub: ['Google sign-in'], kind: 'quiet' },
      { id: 'openai', x: 420, y: 240, w: 160, h: 60, title: 'OpenAI', sub: ['chat completions'], kind: 'quiet' },
      { id: 'express', x: 40, y: 384, w: 310, h: 60, title: 'backend/index.js', mono: true, sub: ['Express API, verifies Firebase ID tokens'], path: `${pf}/backend/index.js` },
      { id: 'fn', x: 40, y: 468, w: 310, h: 60, title: 'backend/functions/index.js', mono: true, sub: ['two HTTPS Cloud Functions'], path: `${pf}/backend/functions/index.js` },
      { id: 'firestore', x: 420, y: 384, w: 160, h: 60, title: 'Firestore', sub: ['users collection'], kind: 'quiet' },
      { id: 'rapid', x: 420, y: 468, w: 160, h: 60, title: 'RapidAPI', sub: ['chat, job search'], kind: 'quiet' },
    ],
    edges: [
      { from: 'gate', fromSide: 'r', to: 'auth', toSide: 'l', label: 'sign in' },
      { from: 'gate', fromSide: 'b', to: 'pages', toSide: 't' },
      { from: 'pages', fromSide: 'b', to: 'local', toSide: 't' },
      { from: 'pages', fromSide: 'b', to: 'api', toSide: 't' },
      { from: 'api', fromSide: 'r', to: 'openai', toSide: 'l', label: 'request' },
      { from: 'express', fromSide: 'r', to: 'firestore', toSide: 'l', label: 'read' },
      { from: 'fn', fromSide: 'r', to: 'rapid', toSide: 'l', label: 'proxy' },
    ],
  },

  site: {
    id: 'fig-site',
    title: 'How this site stays true to the repository',
    desc:
      'The Astro build reads coursework files from src/courses and never writes to them. A line counter, lmucs stats, counts the same tree into data files the build renders. A test file checks every path, line range and count in those data files against the tree on each pull request.',
    width: 600, height: 336,
    nodes: [
      { id: 'tree', x: 20, y: 20, w: 170, h: 66, title: 'src/courses', mono: true, sub: ['coursework,', 'as submitted'], path: 'src/courses' },
      { id: 'build', x: 215, y: 20, w: 170, h: 66, title: 'Astro build', sub: ['quotes files, bundles', 'the compiler'], path: 'src/dashboard/src/lib/repo.ts' },
      { id: 'page', x: 410, y: 20, w: 170, h: 66, title: 'This page', sub: ['static HTML on', 'GitHub Pages'], kind: 'solid' },
      { id: 'count', x: 20, y: 140, w: 170, h: 66, title: 'lmucs stats', mono: true, sub: ['counts tracked lines', 'by language'], path: 'src/packages/lmucs/lmucs/stats.py' },
      { id: 'data', x: 215, y: 140, w: 170, h: 66, title: 'Data files', sub: ['paths, line ranges,', 'counts'], path: 'src/dashboard/src/data' },
      { id: 'tests', x: 117, y: 256, w: 366, h: 60, title: 'tests/site-data.test.mjs', mono: true, sub: ['every claim checked against the tree, on each pull request'], path: 'tests/site-data.test.mjs' },
    ],
    edges: [
      { from: 'tree', fromSide: 'r', to: 'build', toSide: 'l' },
      { from: 'build', fromSide: 'r', to: 'page', toSide: 'l' },
      { from: 'tree', fromSide: 'b', to: 'count', toSide: 't' },
      { from: 'count', fromSide: 'r', to: 'data', toSide: 'l' },
      { from: 'data', fromSide: 't', to: 'build', toSide: 'b' },
      { from: 'tests', fromSide: 't', to: 'data', toSide: 'b', label: 'checks', dashed: true, labelDx: 32, labelDy: 10 },
    ],
  },
};
