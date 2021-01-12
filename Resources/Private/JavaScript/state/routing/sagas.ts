import { take, select, put } from "redux-saga/effects";

import { State } from "..";

import * as business from "../business";
import * as prototypes from "../prototypes";
import * as sites from "../sites";

import * as actions from "./actions";

export function* updateHistoryWhenPrototypeChanges() {
    const baseUrl = (
        yield select(
            (state: State) => state.env.moduleUri
        )
    ) as string;

    while (true) { // eslint-disable-line
        const { payload: prototypeName } = (
            yield take(prototypes.actions.select)
        ) as ReturnType<typeof prototypes.actions.select>;
        const sitePackageKey = (
            yield select(sites.selectors.currentlySelectedSitePackageKey)
        ) as ReturnType<typeof sites.selectors.currentlySelectedSitePackageKey>;
        const currentlySelectedPrototype = (
            yield select(prototypes.selectors.currentlySelected)
        ) as ReturnType<typeof prototypes.selectors.currentlySelected>;

        if (currentlySelectedPrototype) {
            const { title } = currentlySelectedPrototype;
            const path = `${sitePackageKey}/${prototypeName}`;

            take(prototypes.actions.ready);

            if (!history.state || (
                history.state.prototypeName === prototypeName &&
                history.state.sitePackageKey === sitePackageKey
            )) {
                history.replaceState(
                    {prototypeName, sitePackageKey},
                    `Monocle: ${title}`,
                    `${baseUrl}/${path}`
                );
            } else {
                history.pushState(
                    {prototypeName, sitePackageKey},
                    `Monocle: ${title}`,
                    `${baseUrl}/${path}`
                );
            }

            document.title = `Monocle: ${title}`;
        }
    }
};

export function* updateStateOnDirectRouting() {
    while (true) { // eslint-disable-line
        const { payload: { sitePackageKey, prototypeName } } = (
            yield take(actions.route)
        ) as ReturnType<typeof actions.route>;
        const currentlySelectedSitePackageKey = (
            yield select(sites.selectors.currentlySelectedSitePackageKey)
        ) as ReturnType<typeof sites.selectors.currentlySelectedSitePackageKey>;

        if (sitePackageKey === currentlySelectedSitePackageKey && prototypeName) {
            yield put(prototypes.actions.select(prototypeName));
        } else {
            yield put(business.actions.addTask('@sitegeist/monocle/switch-site'));
            yield put(sites.actions.select(sitePackageKey));
        }
    }
};
