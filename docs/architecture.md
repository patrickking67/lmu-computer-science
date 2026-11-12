# Architecture

Six diagrams: how the repository is put together, how the courses build on each other,
one for each of the three lead projects drawn from its code, and the mechanism that lets
the site run a submitted compiler in a browser tab.

Every diagram names files that exist. `tests/site-data.test.mjs` checks the paths and
course codes on this page against the tree, so a rename breaks a test instead of
leaving a diagram wrong.

## 1. The repository

```mermaid
flowchart LR
    record["docs/record.md<br/>course record"]
    courses["src/courses<br/>15 course directories,<br/>as submitted"]
    lmucs["src/packages/lmucs<br/>verify, stats"]
    data["src/dashboard/src/data<br/>courses, programs, stats"]
    site["src/dashboard<br/>Astro static site"]
    map["scripts/course-map.mjs"]
    docs["README.md<br/>docs/course-map.md"]
    tests["tests/site-data.test.mjs"]
    pages["GitHub Pages"]

    record -->|"parsed by"| lmucs
    courses -->|"counted by"| lmucs
    lmucs -->|"line counts copied into"| data
    courses -->|"read at build time<br/>by lib/repo.ts"| site
    data -->|"rendered by"| site
    data -->|"generates"| map
    map -->|"writes"| docs
    tests -.->|"checks against the tree"| data
    tests -.->|"checks for staleness"| docs
    site -->|"deployed on push to main"| pages
```

Coursework flows one way. `src/courses` is read by the line counter and by the site
build, and nothing writes back to it. The dotted edges are the checks: the test file
re-runs the count and regenerates the course map, then fails if the committed copies
differ.

## 2. How the courses build on each other

```mermaid
flowchart TD
    c1010["CMSI 1010, Fall 2021<br/>Programming Laboratory"]
    c2120["CMSI 2120, Spring 2022<br/>Data Structures"]
    c2021["CMSI 2021, Fall 2022<br/>four web apps,<br/>React and Firebase"]
    c2130["CMSI 2130, Spring 2023<br/>A*, CSP, edit distance,<br/>Huffman, minimax in Java"]
    c3550["CMSI 3550, Spring 2024<br/>networking in Rust"]
    c3300["CMSI 3300, Fall 2024<br/>Bayesian and decision networks,<br/>classifiers"]
    c3801["CMSI 3801, Fall 2024<br/>one problem set<br/>in thirteen languages"]
    c4071["CMSI 4071, Fall 2024<br/>Pathfinder specified"]
    c3802["CMSI 3802, Spring 2025<br/>CloudScribe compiler"]
    c4072["CMSI 4072, Spring 2025<br/>Pathfinder built"]

    subgraph nocode["No code in this repository"]
        c1900["CMSI 1900, Fall 2021<br/>Exploring CS"]
        c2210["CMSI 2210, Fall 2022<br/>Systems Organization"]
        c2820["CMSI 2820, Fall 2022<br/>Discrete Mathematics"]
        c3751["CMSI 3751, Fall 2023<br/>Game Design"]
        c3920["CMSI 3920, Summer 2024<br/>Contexts and Ethics"]
    end

    c1010 -->|"programming"| c2120
    c1010 -->|"programming"| c2021
    c2120 -->|"data structures"| c2130
    c2130 -->|"search"| c3300
    c2130 -->|"Java, algorithms"| c3801
    c3550 -->|"Rust"| c3801
    c3801 -->|"use thirteen languages,<br/>then build one"| c3802
    c2021 -->|"React and Firebase"| c4072
    c4071 -->|"specification"| c4072
```

Edges show what a later course reused from an earlier one, read from the code in this
repository and the order the courses were taken. They are not the catalog's
prerequisite list. Two chains end in lead projects: 1010, 2120, 2130, 3801, 3802
produced the compiler, and Pathfinder in 4072 was built to the 4071 specification on
the React and Firebase stack first used in 2021. The five courses in the box left
nothing countable here, so no edge can be drawn from evidence. The strict term-by-term
list is generated in [`course-map.md`](course-map.md).

## 3. CloudScribe: the compiler pipeline

Source: [`src/courses/cmsi-3802/cloudscribe/src`](../src/courses/cmsi-3802/cloudscribe/src).

```mermaid
flowchart LR
    src["source text<br/>.csc"]
    parse["parser.js<br/>Ohm match against<br/>cloudscribe.ohm"]
    analyze["analyzer.js<br/>scopes, types,<br/>static checks"]
    core["core.js<br/>typed node<br/>constructors"]
    optimize["optimizer.js<br/>constant folding,<br/>dead branches"]
    generate["generator.js<br/>emit JavaScript"]
    js["JavaScript"]
    err1["syntax error"]
    err2["semantic error<br/>with line and column"]
    err3["unhandled node kind<br/>TaskDeclaration"]

    src --> parse
    parse -->|"match"| analyze
    parse -.->|"no match"| err1
    analyze -->|"typed program graph"| optimize
    analyze -.->|"rule violated"| err2
    core -->|"builds nodes for"| analyze
    optimize -->|"rewritten graph"| generate
    generate -->|"no task in program"| js
    generate -.->|"program uses task"| err3
```

`compiler.js` runs the four stages in order and can stop after any of them, which is
what the `parsed`, `analyzed`, `optimized` and `js` output types are. The front end is
the strong half: the analyzer is 462 of the 1,040 lines in `src` and carries the scope
chain and every static rule. The last dotted edge is a recorded defect, not a design:
the generator has no case for `task`, the construct every committed example is wrapped
in. [`building.md`](building.md) has the detail, and a second defect in the optimizer.

## 4. The network project: a libp2p stack

Source: [`src/courses/cmsi-3550/Final/src/main.rs`](../src/courses/cmsi-3550/Final/src/main.rs).

```mermaid
flowchart TB
    subgraph app["Application"]
        cli["stdin commands<br/>ls p, ls c, create c, publish c"]
        store["cards.json<br/>local card store"]
        loop["event loop<br/>tokio::select!"]
    end
    subgraph behaviour["Network behaviour"]
        floodsub["Floodsub<br/>topic: cards"]
        mdns["mDNS<br/>peer discovery"]
    end
    subgraph transport["Transport"]
        mplex["mplex<br/>stream multiplexing"]
        noise["Noise XX<br/>authenticated encryption"]
        tcp["TCP<br/>/ip4/0.0.0.0/tcp/0"]
    end

    cli -->|"line"| loop
    loop -->|"read, write"| store
    loop -->|"publish request or response"| floodsub
    floodsub -->|"ListRequest, ListResponse<br/>as JSON"| loop
    mdns -->|"discovered and expired peers"| floodsub
    floodsub --> mplex
    mplex --> noise
    noise --> tcp
```

Read it bottom to top: a TCP socket on an OS-assigned port, upgraded with a Noise XX
handshake keyed by the peer's Ed25519 identity, then multiplexed with mplex. On top of
that sit two libp2p behaviours. mDNS finds peers on the local network by multicast,
outside this TCP stack, and feeds them into Floodsub's view, and Floodsub carries the application protocol: a JSON
`ListRequest` goes out on the `cards` topic and each peer answers with a `ListResponse`
addressed to the requester, holding only the cards marked public. There is no server.
One `tokio::select!` loop multiplexes stdin, the response channel and swarm events.

## 5. Pathfinder: components as submitted

Source: [`src/courses/cmsi-4072/Pathfinder`](../src/courses/cmsi-4072/Pathfinder).

```mermaid
flowchart LR
    subgraph browser["Browser: Vite and React SPA"]
        gate["App.jsx<br/>sign-in gate, then<br/>questionnaire gate"]
        pages["pages<br/>Home, Chat, Tools,<br/>Resources, Settings"]
        api["api.js<br/>chat, resume review,<br/>salary estimate"]
        local["localStorage<br/>questionnaire answers"]
    end
    auth["Firebase Auth<br/>Google sign-in"]
    openai["OpenAI<br/>chat completions"]
    mock["keyword-matched<br/>canned replies"]
    subgraph server["Server side, in the tree"]
        express["backend/index.js<br/>Express, port 5050<br/>verifies ID tokens"]
        fn["backend/functions/index.js<br/>two HTTPS Cloud Functions"]
    end
    firestore["Firestore<br/>users collection"]
    rapid["RapidAPI<br/>chat and job search"]

    gate -->|"signInWithPopup"| auth
    gate --> pages
    pages -->|"read, write"| local
    pages --> api
    api -->|"request"| openai
    api -.->|"on any failure"| mock
    express -->|"verifyIdToken"| auth
    express -->|"users/uid"| firestore
    fn -->|"proxy"| rapid
```

Two things to notice. First, the gate order in `App.jsx` is the product's whole flow:
no user, sign in; no questionnaire, fill it in; otherwise the five pages. Second, the
two server pieces have no inbound edge from the browser. As submitted, the front end
calls OpenAI directly with a placeholder key and falls back to canned replies, the
questionnaire lives in `localStorage`, and nothing in `frontend/src` calls the Express
API or the Cloud Functions. The diagram draws what the code does, not what the design
document intended.

## 6. The mechanism: a submitted compiler running in the page

Source: [`src/dashboard/src/lib/cloudscribe.ts`](../src/dashboard/src/lib/cloudscribe.ts)
and [`src/dashboard/src/components/Playground.astro`](../src/dashboard/src/components/Playground.astro).

```mermaid
sequenceDiagram
    participant V as Visitor
    participant P as Playground.astro
    participant C as lib/cloudscribe.ts
    participant S as Submitted compiler
    participant F as Sandboxed iframe

    Note over C,S: Build time: Vite bundles analyzer.js, optimizer.js,<br/>generator.js and cloudscribe.ohm from src/courses, unmodified
    V->>P: edit source, pick a stage
    P->>C: compile(source, stage)
    C->>S: ohm match, analyze, optimize, generate
    S-->>C: stage output, or the error and the stage it stopped at
    C-->>P: result
    P-->>V: show output or error
    V->>P: Run
    P->>F: srcdoc with the generated JavaScript
    F-->>P: postMessage with console.log lines
    P-->>V: program output
```

The page does not reimplement the compiler. It imports the three submitted stage files
and the grammar straight out of `src/courses` and substitutes exactly one thing: the
submitted `parser.js` loads the grammar with `fs.readFileSync`, which a browser cannot
do, so the grammar text is bundled and matched directly. Generated JavaScript runs in
an iframe with `sandbox="allow-scripts"` and an opaque origin, and its only way out is
a `postMessage` of printed lines. That is also why the page cannot carry a `script-src`
policy: a sandboxed `srcdoc` frame inherits it, and the script is generated from what
the visitor typed.
