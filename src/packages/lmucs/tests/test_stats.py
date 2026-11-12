"""Tests for the language counter.

The point of these is that the numbers published on the site are reproducible.
One test runs against a fixture tree; one runs against the real repository and
asserts the shape of the answer rather than a fixed total, so it does not have
to be edited every time a file changes.
"""

from __future__ import annotations

from pathlib import Path

import pytest

from lmucs.record import find_repo_root
from lmucs.stats import (
    EXCLUDED_NAMES,
    LANGUAGES,
    count_lines,
    count_lines_by_course,
    total_lines,
)


@pytest.fixture
def tree(tmp_path: Path) -> Path:
    courses = tmp_path / "src" / "courses" / "cmsi-9999"
    courses.mkdir(parents=True)
    (courses / "a.py").write_text("one\ntwo\nthree\n")
    (courses / "b.rs").write_text("fn main() {}\n")
    (courses / "c.jsx").write_text("x\ny\n")
    (courses / "d.js").write_text("z\n")
    (courses / "notes.md").write_text("not code\n" * 50)
    (courses / "package-lock.json").write_text("{}\n" * 5000)
    return tmp_path


def test_counts_by_language(tree: Path) -> None:
    counts = {c.name: c.lines for c in count_lines(tree)}
    assert counts == {"Python": 3, "JavaScript": 3, "Rust": 1}


def test_jsx_folds_into_javascript(tree: Path) -> None:
    names = [c.name for c in count_lines(tree)]
    assert names.count("JavaScript") == 1


def test_prose_and_lockfiles_are_not_code(tree: Path) -> None:
    counts = {c.name: c.lines for c in count_lines(tree)}
    assert "Markdown" not in counts
    assert total_lines(count_lines(tree)) == 7


def test_sorted_largest_first(tree: Path) -> None:
    counts = count_lines(tree)
    assert [c.lines for c in counts] == sorted((c.lines for c in counts), reverse=True)


def test_missing_subtree_is_empty_not_an_error(tmp_path: Path) -> None:
    assert count_lines(tmp_path) == []


def test_every_extension_maps_to_a_known_name() -> None:
    # A typo in LANGUAGES would silently split one language into two columns.
    assert all(name and name.strip() == name for name in LANGUAGES.values())
    assert "package-lock.json" in EXCLUDED_NAMES


def test_real_repository_counts_the_languages_the_site_claims() -> None:
    counts = count_lines(find_repo_root())
    names = {c.name for c in counts}
    # The three the front page leads with, and the one nobody else has.
    assert {"JavaScript", "Java", "Rust", "CloudScribe"} <= names
    assert total_lines(counts) > 10_000
    assert all(c.lines > 0 for c in counts)


def test_by_course_splits_on_the_course_directory(tree: Path) -> None:
    other = tree / "src" / "courses" / "cmsi-8888" / "nested" / "deep"
    other.mkdir(parents=True)
    (other / "e.py").write_text("a\nb\n")
    by_course = {
        course: {c.name: c.lines for c in counts}
        for course, counts in count_lines_by_course(tree).items()
    }
    assert by_course == {
        "cmsi-8888": {"Python": 2},
        "cmsi-9999": {"Python": 3, "JavaScript": 3, "Rust": 1},
    }


def test_by_course_sums_to_the_language_totals() -> None:
    root = find_repo_root()
    summed: dict[str, int] = {}
    for counts in count_lines_by_course(root).values():
        for c in counts:
            summed[c.name] = summed.get(c.name, 0) + c.lines
    assert summed == {c.name: c.lines for c in count_lines(root)}
