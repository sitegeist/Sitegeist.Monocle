import {$get} from 'plow-js';
import {select, put, call, fork} from 'redux-saga/effects';

import * as prototypes from './prototypes';
import * as breakpoints from './breakpoints';
import * as locales from './locales';
import * as sites from './sites';
import * as business from './business';
import * as navigation from './navigation';
import * as routing from './routing';

export const actions = {
    prototypes: prototypes.actions,
    breakpoints: breakpoints.actions,
    locales: locales.actions,
    sites: sites.actions,
    business: business.actions,
    navigation: navigation.actions,
    routing: routing.actions
};

export const reducer = (state, action) => [
    prototypes.reducer,
    breakpoints.reducer,
    locales.reducer,
    sites.reducer,
    business.reducer,
    navigation.reducer
].reduce((state, reducer) => reducer(state, action), state);

export const selectors = {
    prototypes: prototypes.selectors,
    breakpoints: breakpoints.selectors,
    locales: locales.selectors,
    sites: sites.selectors,
    business: business.selectors,
    navigation: navigation.selectors
};

export const saga = function * () {
    yield put(business.actions.addTask('@sitegeist/monocle/bootstrap'));

    document.title = 'Monocle: Loading...';

    const moduleUri = yield select($get('env.moduleUri'));
    const routePath = window.location.pathname === moduleUri ? '' : window.location.pathname.substring(moduleUri.length + 1);
    const [routeSitePackageKey, routePrototypeName] = routePath.split('/');

    const defaultSitePackageKey = yield select($get('env.defaultSitePackageKey'));
    const sitePackageKey = routeSitePackageKey || defaultSitePackageKey;

    yield call(sites.sagas.load);
    yield put(sites.actions.select(sitePackageKey));

    yield call(prototypes.sagas.load);

    const listOfPrototypes = yield select(prototypes.selectors.all);

    if (!listOfPrototypes || !Object.keys(listOfPrototypes).length) {
        yield put(business.actions.errorTask('@sitegeist/monocle/bootstrap', `
            The prototype list is empty. Please check the Root.fusion file in your site package "${sitePackageKey}" and
            make sure your components are included correctly.
        `));
        return;
    }

    const defaultPrototypeName = yield select($get(['env', 'previewSettings', 'defaultPrototypeName']));
    const prototypeName = routePrototypeName || defaultPrototypeName || Object.keys(listOfPrototypes)[0];

    if (!prototypeName) {
        yield put(business.actions.errorTask('@sitegeist/monocle/bootstrap', `
            Could not determine default prototypeName. Please make sure to have a defaultPrototypeName configured
            for your site package.
        `));
        return;
    }

    //
    // Fork subsequent sagas
    //
    yield fork(routing.sagas.updateHistoryWhenPrototypeChanges);
    yield fork(prototypes.sagas.renderPrototypeOnSelect);
    yield fork(prototypes.sagas.reloadIframe);
    yield fork(breakpoints.sagas.load);
    yield fork(locales.sagas.load);

    try {
        yield put.resolve(prototypes.actions.select(prototypeName));
    } catch (err) {
        yield put(business.actions.errorTask('@sitegeist/monocle/bootstrap', `
            Could not select default Prototype: ${err.message}
        `));
        return;
    }

    yield put(business.actions.finishTask('@sitegeist/monocle/bootstrap'));

    yield fork(routing.sagas.updateStateOnDirectRouting);
};
