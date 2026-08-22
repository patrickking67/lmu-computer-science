# lmucs

Reads `docs/record.md` — the authoritative course record — and answers questions about it
without anyone re-typing the table into a second place.

```bash
lmucs summary            # totals: courses, credits, terms
lmucs courses            # the fifteen CMSI courses
lmucs verify             # check the record against src/courses/ on disk
```

`verify` is the point. It is the mechanical version of a rule this repository states in
prose: the record is authoritative for which courses exist, and an inventory built from
directories alone undercounts. If a course is recorded but has no directory, or a
directory exists that the record does not list, `verify` exits non-zero and says which.
