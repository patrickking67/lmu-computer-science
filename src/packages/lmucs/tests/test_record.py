from pathlib import Path

import pytest

from lmucs.record import CourseRecord, RecordError, find_repo_root

TABLE = """\
| Term | Course | Title on audit | Bulletin title | Grade | Cr |
|---|---|---|---|---|---|
| Fall 2021 | CMSI 1010 | Computer Programming and Laboratory | Computer Programming Laboratory | B | 4 |
| Fall 2021 | CMSI 1900 | Exploring Computer Science | same | CR | 0 |
| Spring 2025 | CMSI 4072 | Senior Project II | same | A | 4 |
"""


def test_parses_every_course_row():
    r = CourseRecord.from_text(TABLE)
    assert [c.code for c in r.courses] == ["CMSI 1010", "CMSI 1900", "CMSI 4072"]


def test_zero_credit_seminar_is_kept():
    # CMSI 1900 is 0 units. An inventory that drops it undercounts the major,
    # which is exactly the mistake this repository made once already.
    r = CourseRecord.from_text(TABLE)
    assert any(c.code == "CMSI 1900" and c.credits == 0 for c in r.courses)


def test_credits_and_terms():
    r = CourseRecord.from_text(TABLE)
    assert r.total_credits == 8
    assert r.terms == ["Fall 2021", "Spring 2025"]  # deduped, order preserved


def test_slug_matches_directory_layout():
    r = CourseRecord.from_text(TABLE)
    assert r.courses[0].slug == "cmsi-1010"


def test_title_prefers_bulletin_and_resolves_same():
    r = CourseRecord.from_text(TABLE)
    assert r.courses[0].title == "Computer Programming Laboratory"
    assert r.courses[1].title == "Exploring Computer Science"


def test_rows_from_the_no_credit_table_are_not_courses():
    # That table is | Course | Grade | Term | — three columns, not six.
    text = TABLE + "| CMSI 2130 | D | Fall 2022 |\n"
    assert len(CourseRecord.from_text(text).courses) == 3


def test_a_broken_course_row_is_refused_not_skipped():
    # The whole point of the module: a course row that will not parse must stop
    # the read, because skipping it drops a course and the count still looks
    # plausible. "4.0" credits is the kind of edit that does it.
    text = TABLE + "| Fall 2025 | CMSI 5000 | Something | same | A | 4.0 |\n"
    with pytest.raises(RecordError) as exc:
        CourseRecord.from_text(text)
    assert "CMSI 5000" in str(exc.value)


def test_an_empty_cell_in_a_course_row_is_refused():
    text = TABLE + "| Fall 2025 | CMSI 5000 |  | same | A | 4 |\n"
    with pytest.raises(RecordError):
        CourseRecord.from_text(text)


def test_a_differently_shaped_cmsi_row_is_still_skipped_quietly():
    # Only six-cell rows with the code in the second cell are course rows, so
    # the no-credit table stays skipped rather than becoming an error.
    text = TABLE + "| CMSI 2130 | D | Fall 2022 |\n"
    assert len(CourseRecord.from_text(text).courses) == 3


def test_empty_record_is_an_error_not_an_empty_list():
    with pytest.raises(RecordError):
        CourseRecord.from_text("# no table here\n")


def test_verify_reports_both_directions(tmp_path: Path):
    courses = tmp_path / "courses"
    (courses / "cmsi-1010").mkdir(parents=True)
    (courses / "cmsi-1010" / "README.md").write_text("x")
    (courses / "cmsi-9999").mkdir()
    (courses / "cmsi-9999" / "README.md").write_text("x")
    (courses / "cmsi-1900").mkdir()  # exists but has no README

    problems = CourseRecord.from_text(TABLE).verify_against(courses)
    assert "recorded but no directory: src/courses/cmsi-4072" in problems
    assert "directory but not in the record: src/courses/cmsi-9999" in problems
    assert "no README.md: src/courses/cmsi-1900" in problems


def test_verify_is_clean_when_they_agree(tmp_path: Path):
    courses = tmp_path / "courses"
    for slug in ("cmsi-1010", "cmsi-1900", "cmsi-4072"):
        (courses / slug).mkdir(parents=True)
        (courses / slug / "README.md").write_text("x")
    assert CourseRecord.from_text(TABLE).verify_against(courses) == []


def test_missing_courses_dir_is_reported_not_crashed(tmp_path: Path):
    problems = CourseRecord.from_text(TABLE).verify_against(tmp_path / "nope")
    assert len(problems) == 3
    assert all(p.startswith("recorded but no directory") for p in problems)


def test_find_repo_root_rejects_an_unrelated_tree(tmp_path: Path):
    with pytest.raises(RecordError):
        find_repo_root(tmp_path)


def test_the_real_record_agrees_with_the_real_tree():
    """The one test that would catch a course added to disk but not the record."""
    root = find_repo_root(Path(__file__).parent)
    record = CourseRecord.from_path(root / "docs" / "record.md")
    assert len(record.courses) == 15
    assert record.verify_against(root / "src" / "courses") == []
