"""Command line entry point."""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

from .record import CourseRecord, RecordError, find_repo_root


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(prog="lmucs", description=__doc__)
    parser.add_argument(
        "command", choices=("summary", "courses", "verify"), help="what to print"
    )
    parser.add_argument("--root", type=Path, default=None, help="repository root")
    args = parser.parse_args(argv)

    try:
        root = args.root.resolve() if args.root else find_repo_root()
        record = CourseRecord.from_path(root / "docs" / "record.md")
    except RecordError as exc:
        print(f"lmucs: {exc}", file=sys.stderr)
        return 2

    if args.command == "summary":
        print(f"{len(record.courses)} CMSI courses")
        print(f"{record.total_credits} credits")
        print(f"{len(record.terms)} terms, {record.terms[0]} to {record.terms[-1]}")
    elif args.command == "courses":
        width = max(len(c.code) for c in record.courses)
        for c in record.courses:
            print(f"{c.code:<{width}}  {c.term:<16}  {c.title}")
    else:
        problems = record.verify_against(root / "src" / "courses")
        if problems:
            for p in problems:
                print(f"FAIL  {p}", file=sys.stderr)
            return 1
        print(f"ok  {len(record.courses)} courses, record and tree agree")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
