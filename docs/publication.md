# Publication decision

Decided 2026-08-22 by the author, after review. This repository is published publicly
with all material included: coursework, instructor material, answer keys, exam
solutions, grades, and the course audit.

The review below is kept because it records what the decision accepted. Those rows are
not open questions; do not re-litigate them and do not quietly remove material they
cover.

Two items are open, both raised by the 2026-08-22 vendoring pass and neither within any
accepted row. They are held out of version control pending a decision. Until they are
settled the repository stays private and unpushed.

## Accepted risks

| Risk | Scope | Nature |
|---|---|---|
| Instructor copyright | Forney lecture decks, syllabi, assignment PDFs | Course material published without the author holding rights to it |
| Academic integrity | Answer keys and exam solutions for CMSI 3300, CMSI 2130, CMSI 3801 | CMSI 3300 ran again Fall 2025 and CMSI 2130 runs Spring 2026, so solutions to actively assigned work are public |
| Third-party name | 19 PDFs, Pathfinder and cloudscribe deliverables | A group partner is named as co-author on jointly authored work |
| Own academic record | `docs/record.md`, grade markers in directory names | Grades, repeated attempts, and courses that earned no credit are public |
| Instructor rubrics | `CMSI-4072/Pathfinder/Grade Weight.HEIC` | A blank CMSI 4072 deliverable-weighting rubric, no scores filled in |
| Private upstream | `CMSI-4072/Pathfinder/` | Vendored from `patrickking67/pathfinder`, which is private |

## Surfaced 2026-08-22 by the vendoring pass, not yet decided

Two items are outside every row of the table above. Both arrived with the iCloud
vendoring pass. Both are present in the working tree and deliberately **left
uncommitted**, so that either decision is cheap: committing them needs one `git add -f`,
dropping them needs one `rm`. Neither requires rewriting history. The repository is
still private and has not been pushed since the pass.

### UC Berkeley CS188 licence, 8 files

`CMSI-3300/HW3 Answers (Pacman AI)/` holds four distinct complete solutions to the
Berkeley Pacman "Ghostbusters" project. Every file carries this notice:

> You are free to use or extend these projects for educational purposes provided that
> (1) you do not distribute or publish solutions, (2) you retain this notice, and
> (3) you provide clear attribution to UC Berkeley.

This is not the same kind of risk as the *Instructor copyright* and *Academic integrity*
rows above, which weigh a norm and a consequence. This is an express condition of the
licence under which the material was received, and publishing the files would breach it
on its own terms. No student is named in them.

The eight files are the whole exposure; the scan below confirms nothing else in the
repository carries the notice. Removing them costs one directory. Keeping them means
publishing in breach of a stated licence.

```bash
git ls-files -c -o --exclude-standard \
  | while IFS= read -r f; do grep -qF 'you do not distribute or publish' "$f" 2>/dev/null && echo "$f"; done
```

### Third-party scholarly article, 1 file

`CMSI-3920/fraser-2010-injustice-at-intersecting-scales-on-social-exclusion-and-the-global-poor.pdf`
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
| `CMSI-3300/Coursework/Homework/Homework Feedback and Grading.rtf` | The author's own marks, 0% / 51% / 100% / 96% / TBD. Own record, already accepted. |
| `CMSI-3300/.../Homework 2 Grading/dat/hw2_grading.csv` | Bayesian network data, not grades |
| `CMSI-3300/.../Homework 4 Grading/dat/salary_grading.csv` | The public UCI Adult census dataset |
| `CMSI-3802/Coursework (from Classes)/Homework1.pdf`, `CMSI3802 Homework3.pdf` | Co-authored submissions naming the partner, no marks recorded. Credit, so they stay. |

One category was excluded on scope rather than sensitivity. `CMSI 3802`'s source folder
contained a `Class Files/Math 251/` directory, 66 files including 33 instructor
solutions for a mathematics course. This repository is an archive of *computer science*
coursework, and the decision above accepted publishing CS instructor material, not
anything that happened to be filed beside it. Excluded; see
[`vendoring.md`](vendoring.md).

## Verification

Re-run the third-party name scan after any vendoring:

```bash
git ls-files '*.pdf' | while IFS= read -r f; do pdftotext -q "$f" - | grep -qiE 'messner|powell' && echo "$f"; done
```

No LMU email addresses are tracked. No credential-shaped strings are tracked;
`scripts/check-ai-config.sh` asserts this on every run.
