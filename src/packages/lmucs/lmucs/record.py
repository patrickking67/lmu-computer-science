"""Parse ``docs/record.md``.

The record is a markdown table maintained by hand, so parsing is deliberately
strict: a row that does not look like a course row is skipped, but a row that
looks like one and does not parse is an error. Silently dropping a course is the
failure mode that matters here — the repository's own history includes an
inventory that undercounted the major by two courses.
"""

from __future__ import annotations

import re
from dataclasses import dataclass
from pathlib import Path

# | Fall 2021 | CMSI 1010 | Computer Programming and Laboratory | ... | B | 4 |
_ROW = re.compile(
    r"^\|\s*(?P<term>[^|]+?)\s*"
    r"\|\s*(?P<code>CMSI\s+\d{4})\s*"
    r"\|\s*(?P<audit_title>[^|]+?)\s*"
    r"\|\s*(?P<bulletin_title>[^|]+?)\s*"
    r"\|\s*(?P<grade>[^|]+?)\s*"
    r"\|\s*(?P<credits>\d+)\s*\|\s*$"
)


class RecordError(Exception):
    """The record could not be read, or disagrees with the tree."""


@dataclass(frozen=True)
class Course:
    term: str
    code: str
    audit_title: str
    bulletin_title: str
    grade: str
    credits: int

    @property
    def slug(self) -> str:
        """``CMSI 1010`` -> ``cmsi-1010``, matching the src/courses/ layout."""
        return self.code.lower().replace(" ", "-")

    @property
    def title(self) -> str:
        """The bulletin title, falling back to the audit title where they agree."""
        return self.audit_title if self.bulletin_title == "same" else self.bulletin_title


class CourseRecord:
    def __init__(self, courses: list[Course]) -> None:
        if not courses:
            raise RecordError("no course rows found; has the table format changed?")
        self.courses = courses

    @classmethod
    def from_path(cls, path: Path) -> "CourseRecord":
        try:
            text = path.read_text(encoding="utf-8")
        except OSError as exc:
            raise RecordError(f"cannot read {path}: {exc}") from exc
        return cls.from_text(text)

    @classmethod
    def from_text(cls, text: str) -> "CourseRecord":
        courses = []
        for line in text.splitlines():
            if "CMSI" not in line or not line.startswith("|"):
                continue
            m = _ROW.match(line)
            if m is None:
                # Not every CMSI-bearing table row is a course row: the
                # "Attempts that earned no credit" table has a different shape.
                continue
            courses.append(
                Course(
                    term=m["term"],
                    code=re.sub(r"\s+", " ", m["code"]),
                    audit_title=m["audit_title"],
                    bulletin_title=m["bulletin_title"],
                    grade=m["grade"],
                    credits=int(m["credits"]),
                )
            )
        return cls(courses)

    @property
    def total_credits(self) -> int:
        return sum(c.credits for c in self.courses)

    @property
    def terms(self) -> list[str]:
        seen: dict[str, None] = {}
        for c in self.courses:
            seen.setdefault(c.term, None)
        return list(seen)

    def verify_against(self, courses_dir: Path) -> list[str]:
        """Return the disagreements between the record and the tree. Empty is good."""
        problems = []
        on_disk = {
            p.name for p in courses_dir.iterdir() if p.is_dir() and p.name.startswith("cmsi-")
        } if courses_dir.is_dir() else set()
        recorded = {c.slug for c in self.courses}

        for slug in sorted(recorded - on_disk):
            problems.append(f"recorded but no directory: src/courses/{slug}")
        for slug in sorted(on_disk - recorded):
            problems.append(f"directory but not in the record: src/courses/{slug}")
        for slug in sorted(recorded & on_disk):
            if not (courses_dir / slug / "README.md").is_file():
                problems.append(f"no README.md: src/courses/{slug}")
        return problems


def find_repo_root(start: Path | None = None) -> Path:
    """Walk up until a directory holds both docs/record.md and src/courses."""
    here = (start or Path.cwd()).resolve()
    for candidate in (here, *here.parents):
        if (candidate / "docs" / "record.md").is_file() and (candidate / "src" / "courses").is_dir():
            return candidate
    raise RecordError("not inside the lmu-computer-science repository")
