# Publication review

Status as of 2026-08-22: this repository must not be pushed to a public remote
in its current state. The consolidation commit is local only. Nothing has been
published.

`patrickking67/lmu-cs` is public today. Before consolidation it held four files
and no coursework. It now holds 373 files, some of which are not the author's
alone to publish.

## Blockers

| Blocker | Scope | Detail |
|---|---|---|
| Third-party name in graded work | 15 PDFs | Group partner named on Pathfinder and cloudscribe deliverables |
| Private upstream vendored | `CMSI-4072/Pathfinder/` | Source repo `patrickking67/pathfinder` is private on GitHub |
| Graded academic record | `Grade Weight.HEIC`, `Pathfinder ABCDR.pdf` | Assessment artifacts, not the author's own code |

Verify the name scan with:

```bash
git ls-files '*.pdf' | while IFS= read -r f; do pdftotext -q "$f" - | grep -qiE 'messner|powell' && echo "$f"; done
```

## Files naming a third party

```text
CMSI-3802/cloudscribe/assignments/Homework 1.pdf
CMSI-3802/cloudscribe/assignments/Homework 2.pdf
CMSI-4072/Pathfinder/Archive/Pathfinder Schedule - Gantt Chart.pdf
CMSI-4072/Pathfinder/Archive/Software Development Plan (Revised).pdf
CMSI-4072/Pathfinder/Archive/Software Development Plan.pdf
CMSI-4072/Pathfinder/Archive/pathfinder poster.pdf
CMSI-4072/Pathfinder/Deliverables/Pathfinder ABCDR.pdf
CMSI-4072/Pathfinder/Deliverables/Preliminary Poster.pdf
CMSI-4072/Pathfinder/Deliverables/Project Proposal Presentation.pdf
CMSI-4072/Pathfinder/Deliverables/SDD Revised.pdf
CMSI-4072/Pathfinder/Deliverables/SDD_Files/SDD_Pathfinder.pdf
CMSI-4072/Pathfinder/Deliverables/SRS Revised 2.pdf
CMSI-4072/Pathfinder/Deliverables/SRS Revised.pdf
CMSI-4072/Pathfinder/Deliverables/Software Requirements Specification.pdf
CMSI-4072/Pathfinder/Deliverables/Weekly Status Report 1.pdf
```

The cloudscribe `assignments/` PDFs are joint submissions, not instructor
handouts. They carry no copyright notice and no instructor byline.

## Options

| Option | Effect | Cost |
|---|---|---|
| Make `lmu-cs` private | Archive stays complete, push is safe | Coursework is no longer a public portfolio |
| Strip and push public | Public archive, no third-party exposure | Loses 15 deliverables and the Pathfinder tree |
| Ask the partner | Public archive stays complete | Requires their consent, per artifact |

Recommended: private. An archive of graded coursework is a personal record.
The three live repositories (`cloudscribe`, `pathfinder`, `myGainz`) are the
public-facing artifacts and are referenced from `README.md`.

## Cleared

No LMU email addresses appear in any tracked document. No credentials or
secret-shaped strings are tracked (`scripts/check-ai-config.sh` asserts this).
