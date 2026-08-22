# History archive

Thirteen per-course GitHub repositories were deleted before this consolidation. Their
working trees are vendored into this repository; their commit histories are preserved as
git bundles outside it.

## Location

```text
~/Backups/lmu-cs-history-2026-08-22/
```

Not committed. The largest bundle is 161 MB, above GitHub's file limit, and the bundles
duplicate content already vendored here. Back this directory up separately.

## Inventory

Every bundle was verified by fetching all refs into a bare repository and comparing commit
counts against the source. 19 of 19 passed.

| Bundle | Commits | Source | Remote status |
|---|---|---|---|
| `CMSI-3550.bundle` | 21 | `CMSI-3550/` | deleted |
| `CMSI-3801.bundle` | 108 | `CMSI-3801/` | deleted |
| `cmsi3801.bundle` | 108 | root duplicate | deleted |
| `CMSI-3802.bundle` | 9 | `CMSI-3802/` | deleted |
| `CMSI-3802_cloudscribe.bundle` | 77 | `CMSI-3802/cloudscribe/` | alive, diverged |
| `CMSI-2130.bundle` | 8 | `CMSI-2130/` | deleted |
| `Java-Algorithms.bundle` | 8 | root duplicate | deleted |
| `CMSI-2021_myGainz.bundle` | 95 | `CMSI-2021/myGainz/` | alive |
| `mygainz.bundle` | 95 | root duplicate | alive |
| `Senior_Project_Pathfinder.bundle` | 57 | `CMSI-4072/Pathfinder/` | alive, private |
| `pathfinder.bundle` | 57 | root duplicate | alive, private |
| `cmsi3550-p2pfinal.bundle` | 8 | `CMSI-3550/Final/` | deleted |
| `CMSI-3550_Final.bundle` | 8 | same, second clone | deleted |
| `cmsi3550-pgt-p2p.bundle` | 4 | `CMSI-3550/cmsi3550-pgt-p2p/` | deleted |
| `CMSI-3550_cmsi3550-pgt-p2p.bundle` | 4 | same, second clone | deleted |
| `Artist-Data-API.bundle` | 17 | `CMSI-2021/Artist-Data-API/` | deleted |
| `Blog-Application.bundle` | 3 | `CMSI-2021/Blog-Application/` | deleted |
| `Compound-Interest-Calculator.bundle` | 10 | `CMSI-2021/Compound-Interest-Calculator/` | deleted |
| `_parent_lmu-cs.bundle` | 6 | this repository, pre-consolidation | alive |

## Restore a history

```bash
git clone ~/Backups/lmu-cs-history-2026-08-22/CMSI-3801.bundle restored-cmsi3801
```

`git clone` recreates local branches only. To recover every ref including the deleted
remotes' branches:

```bash
git init --bare restored.git
git -C restored.git fetch ~/Backups/lmu-cs-history-2026-08-22/CMSI-3550.bundle '+refs/*:refs/bundled/*'
git -C restored.git for-each-ref refs/bundled
```

## Not recovered

| Item | Reason |
|---|---|
| `cmsi3802` | Deleted from GitHub, never cloned locally |
| `Pathfinder-Old` | Deleted from GitHub, never cloned locally |
| `cmsi3550-quizapr22` | Local clone contained zero objects, a failed clone; remote deleted |
