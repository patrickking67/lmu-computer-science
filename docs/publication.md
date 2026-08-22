# Publication decision

Decided 2026-08-22 by the author, after review. This repository is published publicly
with all material included: coursework, instructor material, answer keys, exam
solutions, grades, and the course audit.

The review below is kept because it records what the decision accepted. Those rows are
not open questions; do not re-litigate them and do not quietly remove material they
cover.

Two items are open, both raised by the 2026-08-22 vendoring pass and neither within any
accepted row. They are held out of version control pending a decision. Until they are
settled the repository stays private and unpushed. They are two different questions, not
a matched pair: one is a licence term, the other is a copyright judgment. Read them
separately.

## Accepted risks

| Risk | Scope | Nature |
|---|---|---|
| Instructor copyright | Forney lecture decks, syllabi, assignment PDFs | Course material published without the author holding rights to it |
| Academic integrity | Answer keys and exam solutions for CMSI 3300, CMSI 2130, CMSI 3801 | CMSI 3300 ran again Fall 2025 and CMSI 2130 runs Spring 2026, so solutions to actively assigned work are public |
| Third-party name | 19 PDFs, Pathfinder and cloudscribe deliverables | A group partner is named as co-author on jointly authored work |
| Own academic record | `docs/record.md`, grade markers in directory names | Grades, repeated attempts, and courses that earned no credit are public |
| Instructor rubrics | `src/courses/cmsi-4072/Pathfinder/Grade Weight.HEIC` | A blank CMSI 4072 deliverable-weighting rubric, no scores filled in |
| Private upstream | `src/courses/cmsi-4072/Pathfinder/` | Vendored from `patrickking67/pathfinder`, which is private |

## Surfaced 2026-08-22 by the vendoring pass, not yet decided

Two items are outside every row of the table above. Both arrived with the iCloud
vendoring pass. Both are present in the working tree and deliberately **left
uncommitted**, so that either decision is cheap: committing them needs one `git add -f`,
dropping them needs one `rm`. Neither requires rewriting history. The repository is
still private and has not been pushed since the pass.

Held, rather than decided, because no rule already in this file reaches them. That is the
distinction that matters: the Math 251 material below was removed without asking anyone,
because a scope rule this document already states decided it. These two are not covered
that way, so they are the author's call and nobody else's.

### UC Berkeley CS188 licence, 8 files

`src/courses/cmsi-3300/HW3 Answers (Pacman AI)/` holds four distinct complete solutions to the
Berkeley Pacman "Ghostbusters" project. Every file carries this notice:

> You are free to use or extend these projects for educational purposes provided that
> (1) you do not distribute or publish solutions, (2) you retain this notice, and
> (3) you provide clear attribution to UC Berkeley.

This is not the same kind of risk as the *Instructor copyright* and *Academic integrity*
rows above, which weigh a norm and a consequence. This is an express condition of the
licence under which the material was received, and publishing the files would breach it
on its own terms. No student is named in them.

It is also not the same question as the article below. That one is a judgment about how
much redistribution of a publisher's PDF is acceptable, and reasonable people land in
different places on it. This one is a stated term: the notice says what may not be done
with the files, and publishing them does that thing. Of the two, this is the one where
the accepted-risk reasoning elsewhere in this document gives no cover.

The eight files are the whole exposure; the scan below confirms nothing else in the
repository carries the notice. Removing them costs one directory. Keeping them means
publishing in breach of a stated licence.

```bash
git ls-files -c -o --exclude-standard \
  | while IFS= read -r f; do grep -qF 'you do not distribute or publish' "$f" 2>/dev/null && echo "$f"; done
```

### Third-party scholarly article, 1 file

`src/courses/cmsi-3920/fraser-2010-injustice-at-intersecting-scales-on-social-exclusion-and-the-global-poor.pdf`
is a journal article by an author with no connection to LMU, distributed as course
reading. The *Instructor copyright* row covers Forney's own decks, syllabi, and
assignment PDFs. It does not cover redistributing a publisher's article.

## Not published

One category is excluded regardless, because it is not the author's to publish:
any document recording a **third party's** grades or assessment. Co-authorship on a
shared deliverable is credit and stays. Another student's mark does not.

If such a file is found, exclude it and note it here rather than committing it.

Checked so far: `Grade Weight.HEIC` is a blank rubric with an empty Evaluation column,
not an assessment record. `Pathfinder ABCDR.pdf` names the group but records no marks.
Nothing tracked exposes another student's grade.

The 2026-08-22 vendoring pass re-ran the check on everything it added:

| File | Finding |
|---|---|
| `src/courses/cmsi-3300/Coursework/Homework/Homework Feedback and Grading.rtf` | The author's own marks, 0% / 51% / 100% / 96% / TBD. Own record, already accepted. |
| `src/courses/cmsi-3300/.../Homework 2 Grading/dat/hw2_grading.csv` | Bayesian network data, not grades |
| `src/courses/cmsi-3300/.../Homework 4 Grading/dat/salary_grading.csv` | The public UCI Adult census dataset |
| `src/courses/cmsi-3802/Coursework (from Classes)/Homework1.pdf`, `CMSI3802 Homework3.pdf` | Co-authored submissions naming the partner, no marks recorded. Credit, so they stay. |

One category was excluded on scope rather than sensitivity. `CMSI 3802`'s source folder
contained a `Class Files/Math 251/` directory, 66 files including 33 instructor
solutions for a mathematics course. This repository is an archive of *computer science*
coursework, and the decision above accepted publishing CS instructor material, not
anything that happened to be filed beside it. Excluded; see
[`vendoring.md`](vendoring.md).

The rule then had to be applied a second time. Eight further Math 251 pages, a complete
practice final exam, were committed before review because they sat in a folder called
`New Folder With Items` rather than one called `Math 251`, and because nobody had opened
the images. They were removed. That document also credits a Math 251 instructor by name,
a third party outside every row of the accepted table. No Math 251 material is tracked
now.

## Verification

Re-run the third-party name scan after any vendoring:

```bash
git ls-files -z '*.pdf' | while IFS= read -r -d '' f; do pdftotext -q "$f" - | grep -qiE 'messner|powell|laurent' && echo "$f"; done
```

**This scan is scoped to three known names, not to third parties in general.** It confirms
where the two group partners and the one instructor found so far appear. It cannot tell
you that a document is free of names, and a pass proves nothing about a name nobody has
thought of yet. It also reads PDFs only: an image carries no extractable text, so no grep
of any kind will see a name inside a screenshot. Images have to be opened and looked at.
The 2026-08-22 pass learned this the hard way; see
[`vendoring.md`](vendoring.md#removed-on-review).

No LMU email addresses are tracked; a scan of every tracked file for
`@lmu.edu` and `@lion.lmu.edu` returns nothing.

Credential-shaped strings **are** tracked. See below.

## Committed credentials: a blocker on publication

Found 2026-08-22 by review, after the sentence above had claimed the opposite for as
long as it existed. It claimed that because `scripts/check-ai-config.sh` said so, and the
check was wrong: it matched `sk-`, `ghp_` and `AKIA` only, and only inside `*.json`,
`*.toml` and `*.md`. None of those three shapes is what a Firebase project leaves behind.
The check now scans every tracked file for private-key blocks, service-account
`private_key` fields, provider tokens, and API keys pasted into request headers, and it
fails on all three items below. **It fails on `main` today.** That is the honest state of
the tree, not a regression introduced by the check.

The repository is still private and has not been pushed publicly, so none of this has
been exposed by *this* archive. That is the only reason these are blockers rather than
incidents. They must be settled before the repository is made public.

| Item | Where | What it is |
|---|---|---|
| Google service-account private key | `src/courses/cmsi-4072/Pathfinder/backend/serviceAccountKey.json` | RSA private key for `firebase-adminsdk-fbsvc@pathfinder-cae4f.iam.gserviceaccount.com`. Firebase Admin SDK credentials bypass Firestore and Storage Security Rules entirely. |
| RapidAPI key | `src/courses/cmsi-4072/Pathfinder/backend/functions/index.js`, lines 16 and 39 | One billable key, hardcoded twice, behind `cors({origin: true})`. |
| Firebase Web API keys | `src/courses/cmsi-2021/Blog-Application`, `src/courses/cmsi-2021/myGainz`, `src/courses/cmsi-4072/Pathfinder/frontend` | Not secrets. Google ships these in every web bundle; they are guarded by Security Rules and API-key restrictions. Reported by the check, never failed. |

Rotation is the remedy, and it is the only part that is not optional. Deleting the files
does not undo a key that has already been written down: `serviceAccountKey.json` entered
this repository in `9cfd959` and is in the history of the upstream `pathfinder`
repository too. Revoke the service-account key in the `pathfinder-cae4f` Google Cloud
console and regenerate the RapidAPI key; after that the tracked copies are inert strings
and the question of what to do with them becomes an archive question rather than a
security one.

That archive question is genuinely open, and it is the author's call for the same reason
the two items above are. Three ways to settle it, and the ordering rule in this file does
not reach any of them:

1. **Delete from `HEAD`, keep the history.** One commit. Consistent with "history is
   preserved, not rewritten", inconsistent with "the archive holds the work as submitted".
2. **Delete from `HEAD` and purge from history.** Removes the strings, and contradicts
   the rule in `AGENTS.md` that this archive does not rewrite history.
3. **Keep both, having rotated.** The archive stays faithful; the check stays red unless
   an allowlist is added, and an allowlist is exactly the mechanism this repository
   refuses elsewhere for hiding files.

Nothing here recommends one over the others. Revoke first; the rest can wait.
