# History archive

Thirteen per-course GitHub repositories were deleted before this consolidation. Their
working trees are vendored into this repository; their commit histories are preserved as
git bundles outside it.

A second pass on 2026-08-22 added ten more bundles from repositories that existed only
inside the iCloud source tree. Those working trees are *not* vendored: a nested
repository becomes a bundle, never a directory here. See [`vendoring.md`](vendoring.md).

## Location

```text
~/Backups/lmu-cs-history-2026-08-22/
```

Not committed. The largest bundle is 161 MB, above GitHub's file limit, and the bundles
duplicate content already vendored here. Back this directory up separately.

## Inventory

Every bundle was verified by fetching all refs into a bare repository and comparing commit
counts against the source. 29 of 29 passed.

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

### Added 2026-08-22, from the iCloud source tree

Origin is the remote each clone was taken from, which for four of these is not the
author's account. `whose` records that.

| Bundle | Commits | Origin | Whose |
|---|---|---|---|
| `CMSI-3300_Homework-1.bundle` | 4 | `cmsi3300-02-fall24/homework1-patrick-king` | author, classroom org |
| `CMSI-3300_Homework-2.bundle` | 5 | `cmsi3300-02-fall24/homework2-patrick-king` | author, classroom org |
| `CMSI-3300_Homework-3.bundle` | 6 | `cmsi3300-02-fall24/homework3-patrick-king` | author, classroom org |
| `CMSI-3300_Homework-4.bundle` | 4 | `cmsi3300-02-fall24/homework4-patrick-king` | author, classroom org |
| `CMSI-3300_Homework-5.bundle` | 8 | `cmsi3300-02-fall24/homework5-patrickgking03` | author, classroom org |
| `CMSI-3801_pk-fall2024-copy.bundle` | 90 | `patrickgking03/cmsi3801-pk-fall2024` | author, older copy |
| `CMSI-3801_gmarzo-coursework.bundle` | 16 | `gmarzo/coursework` | instructor |
| `CMSI-3801_FindMyParty.bundle` | 7 | `devrai21/FindMyParty` | third party |
| `CMSI-3801_Languages-and-Automata.bundle` | 10 | `nmeiswin/cmsi3801-Languages-and-Automata` | third party |
| `CMSI-3550_p2p-app.bundle` | 1 | no remote, local only | author |

`CMSI-3801_pk-fall2024-copy` is a distinct, earlier clone: 90 commits against the 108 in
`CMSI-3801.bundle`. Both are kept.

The three non-author repositories are preserved here, in a private off-machine archive,
because they were part of the coursework as it stood. Nothing from them is vendored into
this repository and none of them is published.

### Deliberately not bundled

Two nested repositories in the iCloud tree were already fully covered and would have
added no objects:

| Repository | Covered by | Evidence |
|---|---|---|
| `CMSI 3550/Coursework` | `CMSI-3550.bundle` | Its two extra local branches, `api` and `api_apr22`, both point at `47eb7dea`, which the existing bundle carries as `refs/remotes/origin/api_apr22`. Only ref names differ. |
| `CMSI 3550/Coursework/P2P Final` | `cmsi3550-p2pfinal.bundle` | Its three refs are an exact subset, all at `8084ea9a`. |

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
