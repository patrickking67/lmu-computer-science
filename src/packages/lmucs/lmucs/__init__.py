"""Read and validate the LMU computer science course record."""

from .record import Course, CourseRecord, RecordError, find_repo_root

__all__ = ["Course", "CourseRecord", "RecordError", "find_repo_root"]
__version__ = "1.0.0"
