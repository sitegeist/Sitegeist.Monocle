import { createAction } from "typesafe-actions";

export const addTask = createAction(
    '@sitegeist/monocle/business/addTask',
    (taskName: string) => taskName
)();

export const finishTask = createAction(
    '@sitegeist/monocle/business/finishTask',
    (taskName: string) => taskName
)();

export const errorTask = createAction(
    '@sitegeist/monocle/business/errorTask',
    (taskName: string, reason: string) => ({taskName, reason})
)();

export const commenceAuthorization = createAction(
    '@sitegeist/monocle/business/commenceAuthorization'
)();

export const authorize = createAction(
    '@sitegeist/monocle/business/authorize',
    (username: string, password: string) => ({username, password})
)();
