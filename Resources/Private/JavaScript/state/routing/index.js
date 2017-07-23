import {createAction} from 'redux-actions';
import {take, select, put, call} from 'redux-saga/effects';
import {$get} from 'plow-js';

import * as business from '../business';
import * as prototypes from '../prototypes';
import * as sites from '../sites';

export const actions = {};

actions.route = createAction(
    '@sitegeist/monocle/routing/route',
    (sitePackageKey, prototypeName) => ({sitePackageKey, prototypeName})
);

export const sagas = {};

sagas.updateHistoryWhenPrototypeChanges = function * () {
    const baseUrl = yield select($get('env.moduleUri'));

    while (true) { // eslint-disable-line
        const prototypeName = (yield take(prototypes.actions.select)).payload;
        const sitePackageKey = yield select(sites.selectors.currentlySelectedSitePackageKey);
        const {title} = yield select(prototypes.selectors.currentlySelected);
        const path = `${sitePackageKey}/${prototypeName}`;

        take(prototypes.actions.ready);

        if (!history.state || (
            history.state.prototypeName === prototypeName &&
            history.state.sitePackageKey === sitePackageKey
        )) {
            history.replaceState({prototypeName, sitePackageKey}, `Monocle: ${title}`, `${baseUrl}/${path}`);
        } else {
            history.pushState({prototypeName, sitePackageKey}, `Monocle: ${title}`, `${baseUrl}/${path}`);
        }

        document.title = `Monocle: ${title}`;
    }
};

sagas.updateStateOnDirectRouting = function * () {
    while (true) { // eslint-disable-line
        const {sitePackageKey, prototypeName} = (yield take(actions.route)).payload;
        const currentlySelectedSitePackageKey = yield select(sites.selectors.currentlySelectedSitePackageKey);

        if (sitePackageKey === currentlySelectedSitePackageKey && prototypeName) {
            yield put(prototypes.actions.select(prototypeName));
        } else {
            yield put(business.actions.addTask('@sitegeist/monocle/switch-site'));
            yield put(sites.actions.select(sitePackageKey));
            yield call(prototypes.sagas.load);

            const listOfPrototypes = yield select(prototypes.selectors.all);

            const defaultPrototypeName = yield select($get(['env', 'defaultPrototypeName', sitePackageKey]));
            const newPrototypeName = prototypeName || defaultPrototypeName || Object.keys(listOfPrototypes)[0];

            yield put(prototypes.actions.select(newPrototypeName));
            yield put(business.actions.finishTask('@sitegeist/monocle/switch-site'));
        }
    }
};
