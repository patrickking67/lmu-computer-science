# Publication decision

Decided 2026-08-22 by the author, after review. This repository is published publicly
with all material included: coursework, instructor material, answer keys, exam
solutions, grades, and the course audit.

The review below is kept because it records what the decision accepted. It is not an
open question.

## Accepted risks

| Risk | Scope | Nature |
|---|---|---|
| Instructor copyright | Forney lecture decks, syllabi, assignment PDFs | Course material published without the author holding rights to it |
| Academic integrity | Answer keys and exam solutions for CMSI 3300, CMSI 2130, CMSI 3801 | CMSI 3300 ran again Fall 2025 and CMSI 2130 runs Spring 2026, so solutions to actively assigned work are public |
| Third-party name | 15 PDFs, Pathfinder and cloudscribe deliverables | A group partner is named as co-author on jointly authored work |
| Own academic record | `docs/record.md`, grade markers in directory names | Grades, repeated attempts, and courses that earned no credit are public |
| Instructor rubrics | `CMSI-4072/Pathfinder/Grade Weight.HEIC` | A blank CMSI 4072 deliverable-weighting rubric, no scores filled in |
| Private upstream | `CMSI-4072/Pathfinder/` | Vendored from `patrickking67/pathfinder`, which is private |

## Not published

One category is excluded regardless, because it is not the author's to publish:
any document recording a **third party's** grades or assessment. Co-authorship on a
shared deliverable is credit and stays. Another student's mark does not.

If such a file is found, exclude it and note it here rather than committing it.

Checked so far: `Grade Weight.HEIC` is a blank rubric with an empty Evaluation column,
not an assessment record. `Pathfinder ABCDR.pdf` names the group but records no marks.
Nothing tracked exposes another student's grade.

## Verification

Re-run the third-party name scan after any vendoring:

```bash
git ls-files '*.pdf' | while IFS= read -r f; do pdftotext -q "$f" - | grep -qiE 'messner|powell' && echo "$f"; done
```

No LMU email addresses are tracked. No credential-shaped strings are tracked;
`scripts/check-ai-config.sh` asserts this on every run.
