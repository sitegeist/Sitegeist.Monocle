import {$get} from 'plow-js';
import {take, select, put, call, fork} from 'redux-saga/effects';

import * as prototypes from './prototypes';
import * as breakpoints from './breakpoints';
import * as sites from './sites';
import * as business from './business';
import * as navigation from './navigation';
import * as routing from './routing';

export const actions = {
    prototypes: prototypes.actions,
    breakpoints: breakpoints.actions,
    sites: sites.actions,
    business: business.actions,
    navigation: navigation.actions,
    routing: routing.actions
};

export const reducer = (state, action) => [
    prototypes.reducer,
    breakpoints.reducer,
    sites.reducer,
    business.reducer,
    navigation.reducer
].reduce((state, reducer) => reducer(state, action), state);

export const selectors = {
    prototypes: prototypes.selectors,
    breakpoints: breakpoints.selectors,
    sites: sites.selectors,
    business: business.selectors,
    navigation: navigation.selectors
};

export const saga = function * () {
    yield put(business.actions.addTask('@sitegeist/monocle/bootstrap'));

    document.title = 'Monocle: Loading...';

    const moduleUri = yield select($get('env.moduleUri'));
    const routePath = window.location.href === moduleUri ? '' : window.location.href.substring(moduleUri.length + 1);
    const [routeSitePackageKey, routePrototypeName] = routePath.split('/');

    const defaultSitePackageKey = yield select($get('env.defaultSitePackageKey'));
    const sitePackageKey = routeSitePackageKey || defaultSitePackageKey;

    yield call(sites.sagas.load);
    yield put(sites.actions.select(sitePackageKey));

    yield call(prototypes.sagas.load);

    const listOfPrototypes = yield select(prototypes.selectors.all);

    const defaultPrototypeName = yield select($get(['env', 'defaultPrototypeName', sitePackageKey]));
    const prototypeName = routePrototypeName || defaultPrototypeName || Object.keys(listOfPrototypes)[0];

    //
    // Fork subsequent sagas
    //
    yield fork(routing.sagas.updateHistoryWhenPrototypeChanges);
    yield fork(prototypes.sagas.renderPrototypeOnSelect);
    yield fork(prototypes.sagas.reloadIframe);
    yield fork(breakpoints.sagas.load);

    yield put(prototypes.actions.select(prototypeName));

    yield put(business.actions.finishTask('@sitegeist/monocle/bootstrap'));

    yield fork(routing.sagas.updateStateOnDirectRouting);
};
