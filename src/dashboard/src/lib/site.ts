/**
 * Site-wide constants and the one URL helper.
 *
 * Every page needs base-path-aware links, and three of them had grown their
 * own copy of the same two lines. BASE_URL is "/" locally and
 * "/<repo>/" on Pages, so joining has to collapse the double slash.
 */
export const BASE = import.meta.env.BASE_URL;

/** Join a path onto the site base. `href('courses')` → `/lmu-computer-science/courses`. */
export const href = (path = '') => `${BASE}/${path}`.replace(/\/{2,}/g, '/');

/** True when `pathname` is the page `path` points at, ignoring trailing slashes. */
export const isCurrent = (pathname: string, path: string) =>
  pathname.replace(/\/$/, '') === href(path).replace(/\/$/, '');

export const site = {
  name: 'LMU Computer Science',
  owner: 'Patrick King',
  years: 'Fall 2021 – Spring 2025',
  advisor: 'Dr. Ray Toal',
  github: 'https://github.com/patrickking67',
  linkedin: 'https://www.linkedin.com/in/patrickgking03/',
  repo: 'https://github.com/patrickking67/lmu-computer-science',
} as const;

/** Blob URL for a path inside this repository. */
export const inRepo = (path: string) => `${site.repo}/blob/main/${path}`;
/** Tree URL for a directory inside this repository. */
export const treeInRepo = (path: string) => `${site.repo}/tree/main/${path}`;
